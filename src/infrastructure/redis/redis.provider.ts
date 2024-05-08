import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  RedisClientType,
  TimeSeriesAggregationType,
  TimeSeriesDuplicatePolicies,
  TimeSeriesEncoding,
} from 'redis';
import IEnv from 'src/common/interface/env.interface';
import { REDIS_PROVIDER } from './inject-key';

export const RedisProvider: Provider = {
  provide: REDIS_PROVIDER,
  useFactory: async (config: ConfigService<IEnv>) => {
    const conn = await createClient({ url: config.get('REDIS_URL') })
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();

    await createTourists(conn as any);
    await createRegister(conn as any);

    return conn;
  },
  inject: [ConfigService],
};

const oneDayInMilliSeconds = 24 * 60 * 60 * 1_000;

async function createTourists(conn: RedisClientType) {
  const touristEnter = await conn.exists('tourists_enter');

  if (!touristEnter) {
    const created = await conn.ts.create('tourists_enter', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      console.log('Created tourists enter timeseries.');
    } else {
      console.log('Error creating tourists enter timeseries :(');
      process.exit(1);
    }
  }

  const touristEnterPerDay = await conn.exists('tourists_enter_per_day');
  if (!touristEnterPerDay) {
    const created = await conn.ts.create('tourists_enter_per_day', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'tourists_enter',
        'tourists_enter_per_day',
        TimeSeriesAggregationType.SUM,
        oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created tourists_enter_per_day timeseries.');
      } else {
        console.log('Error creating tourists_enter_per_day timeseries :(');
        process.exit(1);
      }
    }
  }

  const touristEnterPerMouth = await conn.exists('tourists_enter_per_mouth');
  if (!touristEnterPerMouth) {
    const created = await conn.ts.create('tourists_enter_per_mouth', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'tourists_enter',
        'tourists_enter_per_mouth',
        TimeSeriesAggregationType.SUM,
        30 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created tourists_enter_per_mouth timeseries.');
      } else {
        console.log('Error creating tourists_enter_per_mouth timeseries :(');
        process.exit(1);
      }
    }
  }

  const touristEnterPerYear = await conn.exists('tourists_enter_per_year');
  if (!touristEnterPerYear) {
    const created = await conn.ts.create('tourists_enter_per_year', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'tourists_enter',
        'tourists_enter_per_year',
        TimeSeriesAggregationType.SUM,
        365 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created tourists_enter_per_year timeseries.');
      } else {
        console.log('Error creating tourists_enter_per_year timeseries :(');
        process.exit(1);
      }
    }
  }

  const touristExit = await conn.exists('tourists_exit');

  if (!touristExit) {
    const created = await conn.ts.create('tourists_exit', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      console.log('Created tourists exit timeseries.');
    } else {
      console.log('Error creating tourists exit timeseries :(');
      process.exit(1);
    }
  }

  const touristExitPerDay = await conn.exists('tourists_exit_per_day');
  if (!touristExitPerDay) {
    const created = await conn.ts.create('tourists_exit_per_day', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'tourists_enter',
        'tourists_exit_per_day',
        TimeSeriesAggregationType.SUM,
        oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created tourists_exit_per_day timeseries.');
      } else {
        console.log('Error creating tourists_exit_per_day timeseries :(');
        process.exit(1);
      }
    }
  }

  const touristExitPerMouth = await conn.exists('tourists_exit_per_mouth');
  if (!touristExitPerMouth) {
    const created = await conn.ts.create('tourists_exit_per_mouth', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'tourists_exit',
        'tourists_exit_per_mouth',
        TimeSeriesAggregationType.SUM,
        30 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created tourists_exit_per_mouth timeseries.');
      } else {
        console.log('Error creating tourists_exit_per_mouth timeseries :(');
        process.exit(1);
      }
    }
  }

  const touristExitPerYear = await conn.exists('tourists_exit_per_year');
  if (!touristExitPerYear) {
    const created = await conn.ts.create('tourists_exit_per_year', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'tourists_exit',
        'tourists_exit_per_year',
        TimeSeriesAggregationType.SUM,
        365 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created tourists_exit_per_year timeseries.');
      } else {
        console.log('Error creating tourists_exit_per_year timeseries :(');
        process.exit(1);
      }
    }
  }
}

async function createRegister(conn: RedisClientType) {
  const registerEnter = await conn.exists('register_enter');

  if (!registerEnter) {
    const created = await conn.ts.create('register_enter', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      console.log('Created register_enter timeseries.');
    } else {
      console.log('Error creating register_enter timeseries :(');
      process.exit(1);
    }
  }

  const registerEnterPerDay = await conn.exists('register_enter_per_day');
  if (!registerEnterPerDay) {
    const created = await conn.ts.create('register_enter_per_day', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'register_enter',
        'register_enter_per_day',
        TimeSeriesAggregationType.SUM,
        oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created register_enter_per_day timeseries.');
      } else {
        console.log('Error creating register_enter_per_day timeseries :(');
        process.exit(1);
      }
    }
  }

  const registerEnterPerMouth = await conn.exists('register_enter_per_mouth');
  if (!registerEnterPerMouth) {
    const created = await conn.ts.create('register_enter_per_mouth', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'register_enter',
        'register_enter_per_mouth',
        TimeSeriesAggregationType.SUM,
        30 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created register_enter_per_mouth timeseries.');
      } else {
        console.log('Error creating register_enter_per_mouth timeseries :(');
        process.exit(1);
      }
    }
  }

  const registerEnterPerYear = await conn.exists('register_enter_per_year');
  if (!registerEnterPerYear) {
    const created = await conn.ts.create('register_enter_per_year', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'register_enter',
        'register_enter_per_year',
        TimeSeriesAggregationType.SUM,
        365 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created register_enter_per_year timeseries.');
      } else {
        console.log('Error creating register_enter_per_year timeseries :(');
        process.exit(1);
      }
    }
  }

  const registerExit = await conn.exists('register_exit');

  if (!registerExit) {
    const created = await conn.ts.create('register_exit', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      console.log('Created register exit timeseries.');
    } else {
      console.log('Error creating register exit timeseries :(');
      process.exit(1);
    }
  }

  const registerExitPerDay = await conn.exists('register_exit_per_day');
  if (!registerExitPerDay) {
    const created = await conn.ts.create('register_exit_per_day', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'register_exit',
        'register_exit_per_day',
        TimeSeriesAggregationType.SUM,
        oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created register_exit_per_day timeseries.');
      } else {
        console.log('Error creating register_exit_per_day timeseries :(');
        process.exit(1);
      }
    }
  }

  const registerExitPerMouth = await conn.exists('register_exit_per_mouth');
  if (!registerExitPerMouth) {
    const created = await conn.ts.create('register_exit_per_mouth', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'register_exit',
        'register_exit_per_mouth',
        TimeSeriesAggregationType.SUM,
        30 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created register_exit_per_mouth timeseries.');
      } else {
        console.log('Error creating register_exit_per_mouth timeseries :(');
        process.exit(1);
      }
    }
  }

  const registerExitPerYear = await conn.exists('register_exit_per_year');
  if (!registerExitPerYear) {
    const created = await conn.ts.create('register_exit_per_year', {
      RETENTION: 0,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED,
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK,
    });

    if (created === 'OK') {
      const created = await conn.ts.createRule(
        'register_exit',
        'register_exit_per_year',
        TimeSeriesAggregationType.SUM,
        365 * oneDayInMilliSeconds,
      );

      if (created === 'OK') {
        console.log('Created register_exit_per_year timeseries.');
      } else {
        console.log('Error creating register_exit_per_year timeseries :(');
        process.exit(1);
      }
    }
  }
}
