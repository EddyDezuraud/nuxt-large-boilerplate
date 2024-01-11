import { defineNuxtModule } from '@nuxt/kit';
import path from 'path';

const fullPath = path.resolve(__dirname);
const folderName = path.basename(fullPath);
const capitalizedFolderName = folderName.charAt(0).toUpperCase() + folderName.slice(1);

export default defineNuxtModule({
    hooks: {
        'pages:extend': (pages) => {
            // Add ./pages/_processId dir to the routes
            pages.push(
                {
                    name: 'sample',
                    path: '/sample',
                    file: path.resolve(__dirname, 'pages/index.vue'),
                }
            );
        },
        'components:dirs': (dirs) => {
            // Add ./components dir to the list
            const componentsDir = {
                path: path.resolve(__dirname, './components'),
                prefix: capitalizedFolderName
            };
            dirs.push(componentsDir);
        },
    }
});
