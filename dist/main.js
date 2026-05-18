"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
const originalPort = process.env.PORT;
try {
    const envPath = fs.existsSync(path.join(__dirname, '..', '.env'))
        ? path.join(__dirname, '..', '.env')
        : path.join(__dirname, '..', '.env.production');
    dotenv.config({ path: envPath });
}
catch (e) { }
if (originalPort) {
    process.env.PORT = originalPort;
}
try {
    const envKeys = Object.keys(process.env).join(', ');
    const dbStatus = process.env.DATABASE_URL ? 'PRESENT' : 'MISSING';
    const logContent = `[${new Date().toISOString()}] ENV KEYS: ${envKeys}\nDATABASE_URL is ${dbStatus}\nPORT: ${process.env.PORT}\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'env-debug.log'), logContent);
}
catch (e) { }
const express = __importStar(require("express"));
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors();
        app.use(express.static(path.join(__dirname, '..', 'public')));
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
        }));
        const port = process.env.PORT || 3000;
        await app.listen(port);
        try {
            fs.writeFileSync(path.join(__dirname, '..', 'startup-success.log'), `[${new Date().toISOString()}] Successfully started on port ${port}\n`);
        }
        catch (e) { }
        console.log(`Application is running on: ${await app.getUrl()}`);
    }
    catch (err) {
        try {
            fs.writeFileSync(path.join(__dirname, '..', 'startup-crash.log'), `[${new Date().toISOString()}] FATAL BOOTSTRAP CRASH:\nMessage: ${err.message}\nStack: ${err.stack}\n`);
        }
        catch (e) { }
        console.error('FATAL STARTUP CRASH', err);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map