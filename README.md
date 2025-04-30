# mcp-weather

基于 Model Context Protocol (MCP) 的中国城市天气查询服务，使用 TypeScript 开发，集成和风天气 API。

## 功能特性
- 通过 MCP 协议提供中国城市实时天气查询工具
- 支持通过城市名查询实时天气（温度、体感、风向、湿度等）
- 代码结构清晰，易于扩展

## 目录结构
```
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── src/
│   └── index.ts         # 主程序入口，MCP 服务实现
├── build/               # 编译输出目录
```

## 快速开始
1. 安装依赖
   ```sh
   npm install
   ```
2. 配置和风天气 API KEY
   - 编辑 `src/index.ts`，将 `HEWEATHER_API_KEY` 替换为你的和风天气开发者密钥。
   - 将 `HEWEATHER_API_BASE` 和 `HEWEATHER_GEO_API` 替换为你的 API Host。
3. 构建项目
   ```sh
   npm run build
   ```
4. 启动服务
   ```sh
   npm start
   ```

## MCP 工具接口
- 工具名：`get-china-weather`
- 功能：获取中国城市的实时天气
- 参数：
  - `city`（string）：中国城市名称，如“北京”、“上海”

## 依赖
- @modelcontextprotocol/sdk
- zod
- node-fetch（如需兼容 Node.js 环境）

## License
MIT
