import { Configuration } from './api/giphy/configuration';
import { GifsApiFactory } from './api/giphy';

const configuration = new Configuration({
    apiKey: 'YOURKEYHERE',
});

const Gifs = GifsApiFactory(configuration, fetch);

export { Gifs };
