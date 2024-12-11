cd /d/work/project/renderg-website
npm run build
cd dist
scp -P10022 -r * root@172.20.0.101:/home/renderg/code/rg.sfbp.cn
echo 'http://rg.sfbp.cn'
