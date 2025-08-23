describe('logger no-ops in production', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });

  test('log, warn, info, debug do not call console in production', () => {
    jest.isolateModules(() => {
      process.env.NODE_ENV = 'production';

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logger } = require('../utils/logger');

      logger.log('should not log');
      logger.warn('should not warn');
      logger.info('should not info');
      logger.debug('should not debug');

      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
    });
  });
});


