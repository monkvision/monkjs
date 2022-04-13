# my-awesome-project

Copy environment empty variables to `.env`.
```bash
cp env.txt .env
```

Link needed Monk modules.
```bash
cd ../../packages/corejs && yarn link && cd ../../services/inspection-report && yarn link @monkvision/corejs
```

Update local variables and start project.
```yarn
yarn install && yarn start
```
