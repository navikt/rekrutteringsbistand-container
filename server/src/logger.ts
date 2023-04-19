import fs from 'fs';
import winston from 'winston';
import winstonSyslog from 'winston-syslog';

const { NAIS_APP_NAME } = process.env;

export const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

const secureLogPath = () =>
    fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log';

export const secureLog = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: secureLogPath(),
            maxsize: 50000000,
        }),
    ],
});

export const auditLog = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: winston.format.printf(({ message }) => message),
    transports: [
        new winstonSyslog.Syslog({
            host: 'audit.nais',
            port: 6514,
            app_name: NAIS_APP_NAME,
            protocol: 'tcp',
            eol: '\n',
        }),
    ],
});

export const opprettLoggmeldingForAuditlogg = (
    melding: string,
    fnrEllerAktørId: string,
    navIdent: string
): string => {
    const header = `CEF:0|${NAIS_APP_NAME}|AuditLogger|1.0|audit:access|Sporingslogg|INFO`;
    const extension = `flexString1=Permit\
            msg=${melding}\
            duid=${fnrEllerAktørId}
            flexString1Label=Decision\
            end=${Date.now()}\
            suid=${navIdent}`.replace(/\s+/g, ' ');

    return `${header}|${extension}`;
};

/*export class AuditLogg {
    auditLogger: Log4js.Logger;

    constructor() {
        logger.info('Er inni konstruktøren til AuditLogg');
        this.auditLogger = this.setup();
    }

    setup() {
        if (process.env.NAIS_APP_NAME) {
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
        }

        return Log4js.getLogger('auditLogger');
    }

    loggSpesifisertKandidatsøk = (fnrEllerAktørId: string, navIdent: string) => {
        logger.info('er inni loggSpesifisertKanddiatsøk');
        const header = `CEF:0|${process.env.NAIS_APP_NAME}|AuditLogger|1.0|audit:access|Sporingslogg|INFO|`;
        const msg = `${header}flexString1=Permit\
            msg=NAV-ansatt har gjort spesifikt kandidatsøk på brukeren\
            duid=${fnrEllerAktørId}
            flexString1Label=Decision\
            end=${Date.now()}\
            suid=${navIdent}\
        `.replace(/\s+/g, ' ');
        this.auditLogger.info(msg);
        secureLog.info(msg);
    };
}

export const auditLogg = new AuditLogg();
*/
