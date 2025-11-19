## UnionMaster CRM – Frontend

React-based dashboard for UnionMaster. It consumes the Express API, listens for Socket.IO events, and provides lead management, analytics, and notifications.

### Stack
- React 19 (Create React App)
- Redux Toolkit + React Redux
- React Router v7
- React Hook Form + Yup
- React Hot Toast
- Recharts + Tailwind-style utility classes

### Setup Guide
```bash
cd test/master
cp .env.example .env          # create if missing, see below
npm install
npm start                     # http://localhost:3000
```

`.env` example:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Available Scripts
| Command | Description |
| --- | --- |
| `npm start` | CRA dev server with hot reload |
| `npm run build` | Production bundle |
| `npm test` | CRA test runner |

### Key Features
- **Auth**: Login screen with React Hook Form validation and JWT persistence.
- **Dashboard**: KPI cards, line/pie/area charts powered by Recharts.
- **Leads**: Search, status filter, pagination, responsive table, and modal create/edit with Yup validation.
- **Lead Detail**: Activity logging for notes/calls/meetings, timeline display, socket-driven updates.
- **Notifications**: Bell dropdown backed by `/api/notifications` plus real-time pushes.
- **Users**: Admin-only list with modal creation and confirmation deletes.

### Socket Wiring
`src/api/socket.js` initializes the client, and `src/api/socketListeners.js` dispatches slice actions for leads, activities, and notifications. The app sets up listeners after login (see `src/App.js`).

### Linking to Backend / Hosted Demo
Set `REACT_APP_API_URL` to the backend `/api` base and `REACT_APP_SOCKET_URL` to the server origin (no `/api`). The production build at [https://master-beryl-one.vercel.app/](https://master-beryl-one.vercel.app/) points to [https://backend-master-tpmq.onrender.com](https://backend-master-tpmq.onrender.com).

### Project Structure
```
src/
├── api/           # axios client + socket helpers
├── components/    # modal, cards, layout pieces
├── hooks/         # useAuth
├── pages/         # route components (Dashboard, Leads, etc.)
├── store/         # Redux slices
└── utils/         # formatting helpers
```

### Testing Tips
- Use seeded credentials from `backend/seeds/seedUsers.js` (e.g., `admin@crm.test / Admin@123`).
- Ensure the backend is running locally or configure the `.env` variables to the hosted API before starting `npm start`.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
