# StudiCar
## Getting started
### Prerequisites
- Git
- node + npm
- Quasar `npm install -g @quasar/cli`
- Quasar Icon-Genie `quasar ext add @quasar/icon-genie`
- Recommended: Visual Studio Code with Vetur Extension

### To clone Github-Repository:
```bash
git clone https://[Github-Username]:[Github_password]@github.com/F1nnM/StudiCar.git
```
### Running local version
#### PWA
```bash
cd PWA
npm run dev
```
or in VS CODE, in the bottom left corner: NPM SCRIPTS > `PWA/package.json` > `dev - PWA` > hover > little triangle to run

This will open the page in the browser. The address is http://localhost:3000

#### API
```bash
cd API
npm run start
```
or in VS CODE, in the bottom left corner: NPM SCRIPTS > `API/package.json` > `start - API` > hover > little triangle to run

The API can be reached at simply http://localhost

### To deploy to [dev-server](https://dev.studicar.mfinn.de)
- push to repository
- easy as that

### To deploy to [prod-server](https://studicar.mfinn.de)
- Check if everything works
- Create pull-request for dev-branch
- Accept pull-request and merge
- done
