import winston from 'winston';
import fs from 'fs';
import Log4js from 'log4js';

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

export class AuditLogg {
    auditLogger: Log4js.Logger;

    constructor() {
        this.auditLogger = this.setup();
    }
    setup() {
        Log4js.configure({
            appenders: {
                auditLogger: {
                    type: 'tcp',
                    host: 'audit.nais',
                    port: 6514,
                    layout: {
                        type: 'pattern',
                        pattern: '%d %h %x{app_name}: %m',
                        tokens: {
                            app_name: function () {
                                return process.env.NAIS_APP_NAME;
                            },
                        },
                    },
                    endMsg: '\n',
                },
            },
            categories: {
                default: { appenders: ['auditLogger'], level: 'info' },
            },
        });

        return Log4js.getLogger('auditLogger');
    }

    loggSpesifisertKandidatsøk = (aktørIdEllerFnr: string, navIdent: string) => {
        const header = `CEF:0|${process.env.NAIS_APP_NAME}|AuditLogger|1.0|audit:access|Sporingslogg|INFO|`;
        const msg = `${header}flexString1=Permit\
            msg=NAV-ansatt har gjort spesifikt kandidatsøk på brukeren\
            duid=${aktørIdEllerFnr}
            flexString1Label=Decision\
            end=${Date.now()}\
            suid=${navIdent}\
        `.replace(/\s+/g, ' ');
        this.auditLogger.info(msg);
    };
}
