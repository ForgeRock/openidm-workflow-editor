<p align="center">  
  <i>Please note this project is an opensource unoffical project. While members of the Forgerock development team are working on this, it is not offically supported by Forgerock.</i>
</p>
<p align="center">
  <b>Forgerock Workflow Editor - UI</b>
  <p align="center">
    Workflow editor for the Forgerock platform and standalone IDM.
    <br>
    <a href="https://backstage.forgerock.com/docs/"><strong>Explore ForgeRock docs »</strong></a>
  </p>
  <p align="center">
    The purpose of this readme is to help users setup either standalone workflow editor or deploy a workflow editor for a Platform / IDM instance. 
  </p>
</p>

## Table of contents

- [Project notes](#project-notes)
- [Quick start](#quick-start)
  - [Development Server](#dev-server)
  - [IDM Integration](#IDM-integration)

<a name="project-notes"></a>
## Project Notes

- Currently, this project does not provide any means of authentication. To use authentication, you can build and include the project in your Forgerock platform or configure the development sever to point to your Platform / IDM instance to share the same authentication session.
- Although the editor may work without Forgerock Platform, its functions will be limited.

<a name="quick-start"></a>
## Quick start

There are two methods to get the Workflow Editor running:

- [Development Server](#dev-server) - Runs a standalone node server to allow for workflow editor use and project development/modifications.
- [IDM Integration](#idm-integration)

<a name="dev-server"></a>
### Development Server

Development server notes:
- By default, uses port `8080`. Auto-increments if port `8080` is unavailable.
- Assumes `openidm` is the context for the rest service (For example, http://localhost:8080/openidm/info). For a custom context, edit `/path/to/openidm-workflow-editor/.env`, and update the variables `VUE_APP_IDM_HOST` and `VUE_APP_IDM_CONTEXT`.
- Supports hot reloading and error display when code is changed.
- Built off [Vue CLI 3](https://cli.vuejs.org/config/).

#### To build and run the develpoment server

1. [Download and install the latest node](https://nodejs.org/en/download/) or verify your node version `node -v`.
1. Check that you have the latest npm `npm install npm@latest -g`.
1. Clone or download the Workflow Editor project repo: `https://stash.forgerock.org/projects/OPENIDM/repos/openidm-workflow-editor/browse`.
1. Navigate to your `openidm-workflow-editor` directory and install dependencies `npm install`.
1. Edit `vue.config.js`, and update `proxyTable:target` to point to your target IDM.
1. Start up target IDM (default startup is `http://localhost:8080`).
1. Start development server `npm run serve`.

#### Development server project commands
```
npm install
```
Compile and hot-reload for development
```
npm run serve
```
Compiles and minifies for production
```
npm run build
```
Lints and fixes files
```
npm run lint
```

<a name="idm-integration"></a>
### IDM Integration

1. Check that you have the latest npm `npm install npm@latest -g`.
1. Clone or download the Workflow Editor project repo: `https://stash.forgerock.org/projects/OPENIDM/repos/openidm-workflow-editor/browse`.
1. From the project repo, copy `/public/ui.context-workflow.json` to your IDM project's `/conf` directory. 
1. In the `/path/to/openidm/ui` directory, create a `workflow` directory.
1. From the root of your cloned/downloaded Workflow Editor repo, build the project `npm run build`.
1. After the project finishes building, copy the generated content from the `/project/dist` repo to `/path/to/openidm/ui/workflow`.
1. Start your IDM instance.
1. You should now be able to navigate to the `/workflow` endpoint (Example default IDM configuration, `http://localhost:8080/workflow/`)