// https://github.com/expo/eas-cli/issues/228#issuecomment-1151880990

import fs from 'fs';

const gitignore = fs.readFileSync('./.gitignore', 'utf8');

const easignore = gitignore.split('### EASINCLUDE! ###')[0];

fs.writeFileSync('./.easignore', easignore);
