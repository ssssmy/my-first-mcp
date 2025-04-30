import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// 和风天气API配置（https://dev.qweather.com/）
const HEWEATHER_API_KEY = process.env.HEWEATHER_API_KEY; // TODO: 替换为你的KEY
const HEWEATHER_API_BASE = process.env.HEWEATHER_API_HOST + "/v7/weather/now";
const HEWEATHER_GEO_API = process.env.HEWEATHER_API_HOST + "/geo/v2/city/lookup";
const server = new McpServer({
    name: "weather",
    version: "3.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// 根据城市名获取locationId
async function getLocationId(city) {
    const url = `${HEWEATHER_GEO_API}?location=${encodeURIComponent(city)}&key=${HEWEATHER_API_KEY}`;
    console.log('url:', url);
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.code === "200" && data.location && data.location.length > 0) {
            return data.location[0].id;
        }
        return null;
    }
    catch (e) {
        console.error("Error fetching locationId:", e);
        return null;
    }
}
// 获取实时天气
async function fetchWeatherNow(locationId) {
    const url = `${HEWEATHER_API_BASE}?location=${locationId}&key=${HEWEATHER_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }
    catch (e) {
        console.error("Error fetching weather:", e);
        return null;
    }
}
// 注册中国城市天气查询工具
server.tool("get-china-weather", "获取中国城市的实时天气（基于和风天气API）", {
    city: z.string().describe("中国城市名称，如北京、上海、广州")
}, async ({ city }) => {
    const locationId = await getLocationId(city);
    if (!locationId) {
        return { content: [{ type: "text", text: `未找到城市：${city}` }] };
    }
    const data = await fetchWeatherNow(locationId);
    if (!data || data.code !== "200" || !data.now) {
        return { content: [{ type: "text", text: `无法获取${city}的天气信息。` }] };
    }
    const now = data.now;
    const result = `【${city}】天气：${now.text}\n` +
        `气温：${now.temp}℃\n` +
        `体感温度：${now.feelsLike}℃\n` +
        `风向：${now.windDir}，风速：${now.windSpeed}km/h\n` +
        `湿度：${now.humidity}%`;
    return { content: [{ type: "text", text: result }] };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio (HeWeather China version)");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
