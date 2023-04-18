import fs from 'fs';
import Log4js from 'log4js';

const winston = require('winston');

require('winston-syslog');

const localhost = require('os').hostname();

const secureLogPath = () =>
    fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log';
//%d %h %x{app_name}: %m
const mittFormat = winston.format.printf(({ message, timestamp }) => {
    return `${timestamp} ${process.env.NAIS_APP_NAME}: ${message}`;
});

const getLocalISOTime = () => {
    const tzoffset = new Date().getTimezoneOffset() * 6000;
    return new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
};

const loggFormat = winston.format.combine(
    winston.format.timestamp({
        format: new Date().toISOString(),
    }),
    winston.format.splat(),
    mittFormat
);

winston.loggers.add('logger', {
    levels: winston.config.syslog.levels,
    format: loggFormat,
    transports: [new winston.transports.Console()],
});

winston.loggers.add('secureLog', {
    levels: winston.config.syslog.levels,
    format: loggFormat,
    transports: [
        new winston.transports.File({
            filename: secureLogPath(),
            maxsize: 5242880,
        }),
    ],
});

/*winston.loggers.add('auditLog', {
    levels: winston.config.syslog.levels,
    format: loggFormat,
    transports: [
        new winston.transports.Syslog({
            host: 'audit.nais',
            port: 6514,
            app_name: process.env.NAIS_APP_NAME,
            protocol: 'tcp',
        }),
    ],
});*/

export const logger = winston.loggers.get('logger');
export const secureLog = winston.loggers.get('secureLog');

//export const auditLog = winston.loggers.get('auditLog');

export const spesifisertKandidatsøkCEFLoggformat = (
    fnrEllerAktørId: string,
    navIdent: string
): string => {
    const header = `CEF:0|${process.env.NAIS_APP_NAME}|AuditLogger|1.0|audit:access|Sporingslogg|INFO|`;
    const msg = `${header}flexString1=Permit\
            msg=NAV-ansatt har gjort spesifikt kandidatsøk på brukeren\
            duid=${fnrEllerAktørId}
            flexString1Label=Decision\
            end=${Date.now()}\
            suid=${navIdent}\
        `.replace(/\s+/g, ' ');
    return msg;
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
