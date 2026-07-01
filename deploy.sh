#!/bin/bash
echo "Building site..."
npm run build

echo "Deploying to server..."
rsync -avz --delete dist/ rg@104.237.128.61:/var/www/nittisnyc.com/_site/

echo "Deployment complete!"