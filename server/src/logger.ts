import winston from 'winston';
import fs from 'fs';

const secureLogPath = () =>
    fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log';

export const logger = winston.createLogger({
    format: winston.format.json(),
    transports: new winston.transports.Console(),
});

export const secureLog = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: new winston.transports.File({ filename: secureLogPath(), maxsize: 5242880 }),
});
