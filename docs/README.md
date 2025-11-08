# Stitched - Journaling App

<img align="right" style="width:150px; height:auto;" src="/frontend/resources/splash.png">

<p>
  <img src="https://img.shields.io/badge/Ionic-grey?logo=ionic">
  <img src="https://img.shields.io/badge/React-grey?logo=react">
  <img src="https://img.shields.io/badge/TypeScript-grey?logo=typescript">
  <img src="https://img.shields.io/badge/Capacitor-grey?logo=capacitor">
  <img src="https://img.shields.io/badge/Node.js-grey?logo=node.js">
  <img src="https://img.shields.io/badge/Express.js-grey?logo=express">
  <img src="https://img.shields.io/badge/MongoDB-grey?logo=mongodb">
  <img src="https://img.shields.io/badge/🔨-Prototype_App-grey?labelColor=lightgrey">
</p>

A mobile journaling app built with Ionic (React & TypeScript) and a Node.js/Express backend using MongoDB.<br>
Stitched supports tracking recurring tasks (Moments), daily notes (Memories), and events/episodes (Mementos), with built-in history look-up and statistics.

> [!CAUTION]
> Development on this project is currently paused, and it isn't production-ready. See [Current Status & Limitations](#current-status--limitations) for details.

<details>
  <summary><h3>Content</h3></summary>

- [Concept](#concept)
  - [Moment](#moment)
  - [Memory](#memory)
  - [Memento](#memento)
- [Current Status \& Limitations](#current-status--limitations)
  - [Limited Frontend and Non-Dynamic UI](#limited-frontend-and-non-dynamic-ui)
  - [Notifications](#notifications)
  - [Debugging](#debugging)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Database](#database)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
    - [Android](#android)
    - [iOS](#ios)
- [Usage](#usage)
- [Future Plans](#future-plans)

</details>
<hr>

<p align="center">
  <sub>Journal Page</sub><br>
  <img style="width:250px; height:auto;" src="https://github.com/user-attachments/assets/39fdbb08-b889-4fc0-a002-dbe7bc7c93c0" />
</p>

# Concept

Stitched has three types of data one can journal:

## Moment

<div inline="float" align="right"><sub>Journal - Moments Checklist</sub></div>
<img align="right" style="width:150px; height:auto;" src="https://github.com/user-attachments/assets/0e9c91ec-a025-4d9f-9ac1-eaef65544c55" />

Recurring tasks with flexible schedules.

For example, "Lunch" can be tracked as a **daily** task, or "Laundry" as a task to complete **twice per month**.<br>
Each moment is displayed differently based on its frequency and previous completions, indicating whether it is <ins>due</ins>, <ins>could be done</ins> today, or <ins>not due</ins>.

The **History** tab displays when each task was completed, didn't need to be done, or was skipped, along with statistics such as completion percentage.

<p align="center">
  <sub>History - "Lunch" Moment</sub>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  <sub>History - "Laundry" Moment</sub>
  <br>
  <img style="width:auto; height:500px;" src="https://github.com/user-attachments/assets/80f9ca39-585c-4ec7-9d13-69b5cf3178dd" />
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  <img style="width:auto; height:500px;" src="https://github.com/user-attachments/assets/ae5fea27-6dcc-4bd1-bf2f-352dc3df74f2" />
</p>

## Memory

<div inline="float" align="right"><sub>Journal - Memories Notes</sub>&nbsp;&nbsp;&nbsp;</div>
<img align="right" style="width:160px; height:auto;" src="https://github.com/user-attachments/assets/97e098d8-fa57-4efd-811e-f588608f1b1d" />

Daily notes with custom titles.

For example, a "Daily summary" note can list the activities of the day, or an "Ideas" note can store more abstract thoughts.

> [!NOTE]
> Notes are rendered with small formatting conversions for readability:
>
> - `- List` -> `• List`
> - `[ ] Empty checkbox` -> `☐ Empty checkbox`
> - `[x] Checked checkbox` -> `☒ Checked checkbox`
> - `This is complete V` -> `This is complete ✓`
> - `This is complete X` -> `This is complete ✗`
> - `---` -> `⎯⎯⎯⎯⎯⎯⎯⎯⎯` (separator)

The **History** tab includes a search bar to quickly find past notes by <ins>keyword</ins>.

<p align="center">
  <sub>History - Memories with Keyword "readme"</sub><br>
  <img style="width:auto; height:400px;" src="https://github.com/user-attachments/assets/9f0af58c-3d94-4ffd-ad71-079396e77f76" />
</p>

## Memento

<div inline="float" align="right"><sub>Memento Modal - Editing "Sick" Memento</sub> &nbsp;</div>
<img align="right" style="width:250px; height:auto;" src="https://github.com/user-attachments/assets/5624fc2f-2b11-40f8-b216-b9f71aa2c50f" />

Episodes or events.

For example, they can represent vacations, projects, being sick or having headaches. Virtually anything with a <ins>start</ins> and <ins>end</ins> date.<br>
Mementos can also predict future occurrences, which is useful for tracking recurring events - such as planning vacations at regular intervals or anticipating recurring headaches. Works for tracking periods too.<br>
Predictions are displayed on the main calendar.

<p align="center">
  <sub>Journal - Ongoing Mementos</sub><br>
  <img style="width:auto; height:120px;" src="https://github.com/user-attachments/assets/aed3a5eb-751d-47f8-a248-77486b4ad92e" />
  <br>
  <sub>Journal - Memento Prediction</sub><br>
  <img style="width:auto; height:120px;" src="https://github.com/user-attachments/assets/615bacc3-623e-404f-b7b0-2589b948842e" />
</p>

> [!NOTE]
> To add/edit a memento:
>
> 1. Tap `Add started`.
> 2. Select type from the list.
> 3. Select a `start` date.
> 4. Optionally, tap the `end` date slot to set the end date.<br>
>    (_To remove the end date tap the selected date again_)

The **History** tab lists all past mementos, along with statistics such as average duration and intervals, either individually or grouped by category.

<p align="center">
  <sub>History - "Headache" Memento</sub>
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  <sub>History - "Social" Category</sub>
  &nbsp; &nbsp;
  <br>
  <img style="width:auto; height:600px;" src="https://github.com/user-attachments/assets/56ebcdd4-7d0f-4f8e-9584-53c168223356" />
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  <img style="width:auto; height:600px;" src="https://github.com/user-attachments/assets/f2558bb3-f4c6-4d21-b859-ed75bf338525" />
</p>

# Current Status & Limitations

Stitched is functional but currently it's in a paused development state. The following limitations apply to this prototype version.

> [!NOTE]
> It is not recommended to use this app's current state as is, but rather as inspiration for your own projects.

## Limited Frontend and Non-Dynamic UI

The frontend lacks several features, such as the ability to adjust moment, memory, or memento settings directly within the UI. These options need to be be modified manually in the database.

Additionally, the layout was designed specifically for my Android device and will not display correctly on most screen sizes or platforms.

## Notifications

The app is using Capacitor's `Local Notifications`, which are limited in functionality and did not meet the intended design for the app.

Using **non-simple** notifications (moment, memory, or memento) is unintuitive - when the app asks if a moment was complete, pressing `Yes` opens the app, loads the data, and then marks it as complete. Pressing `No` also opens the app. Ideally, neither action would open the app, but this isn't possible using `Local Notifications`.

> [!NOTE]
> This is the reason the <ins>simple notifications</ins> were implemented, sending generic notifications in set times regardless of what was complete or not complete during the day.

These limitations were a major reason why development on this version was paused and why a future rebuild is planned using `Push Notifications`, which would allow background actions and more advanced features.

## Debugging

The app is currently in a "testing" state. Some features were never finalized, but they remain functional enough to explore the core concepts.

- Multiple files have a `printLogs` boolean at the top, allowing to enable/disable debug logs for that file.
- A race condition can occur during new entry creation. Although a queue system exists, entries can still be duplicated if multiple fields are updated too quickly on a new day, and some content may be lost.
- Notifications sometimes fail to schedule on app start, requiring a manual refresh (although it's possibly an emulator only issue and won't happen on proper builds).

The `History` tab has a `Debug` subpage, allowing to copy the selected day's data to the clipboard and refreshing notifications manually. Both actions print debug information to the console.

# Project Structure

The `frontend/src/` folder:

- **components/** - The app's components:
  - **calendar/** - A custom calendar hook & a calendar reset button.
  - **history/** - The subpages displayed under the `History` tab:
    - **debug/** - Debug subpage, allows copying the selected day's data and manually refreshing the notifications.
    - **memento/** - Memento subpage components.
    - **memory/** - Memory subpage components.
    - **moment/** - Moment subpage components.
    - **DebugPage.tsx** - Debug subpage.
    - **EmptyCard.tsx** - Component used for empty blocks.
    - **MementoHistory.tsx** - Memento history subpage.
    - **MomentHistory.tsx** - Moment history subpage.
    - **MemoryHistory.tsx** - Memory history subpage.
  - **journal/** - The components displayed under the `Journal` tab:
    - **Calendar.tsx** - The app's main calendar.
    - **Mementos.tsx** - The mementos area at the bottom of the screen.
    - **MemModal.tsx** - Memento adding/editing modal.
    - **Memory.tsx** - The memory textbox blocks.
    - **Moments.tsx** - Moments checkboxes list.
  - **context/** - The app's context:
    - **Context.jsx** - Main context provider, fetches data from the backend and initializes other contexts.
    - **useEntries.jsx** - Keeps track of the selected entry (based on date), updates memories and moments in the database.
    - **useExtendedMemento.jsx** - Extends memento data: calculates statistics, predicts end dates, and future occurrences.
    - **useExtendedMoment.jsx** - Extends moment data: calculates `due`/`could do`/`not due` status based on frequency.
    - **useMementosHistory.jsx** - Keeps track of the selected memento in the `History` tab and its data.
    - **useMementos.jsx** - Keeps track of current mementos (based on date), updates mementos in the database.
    - **useMemoryHistory.jsx** - Keeps track of the memory list in the `History` tab and their data.
    - **useMomentHistory.jsx** - Keeps track of the selected moment in the `History` tab and its data.
    - **utils.jsx** - Utility functions for the app.
  - **pages/** - App's main pages:
    - **History.tsx** - The `History` tab page.
    - **Journal.tsx** - The `Journal` tab page.
  - **theme/** - Color presets and custom css files.
  - **App.tsx** - App main page and tab selection.
  - **main.tsx** - The app's entry point.

> [!NOTE]
> Other folders and files were generated by Ionic.

The `backend/` folder:

- **stitched/**
  - **api.js** - The API endpoints.
  - **database.js** - The database schemas and connection.
- **index.js** - The app's entry point.
- **Dockerfile** - For containerizing the backend - useful to host on a server. Can be deleted if not in use.

> [!NOTE]
> The backend is intentionally minimal, so it can be integrated into existing Express apps without requiring a separate deployment.<br>
> To attach to an existing app, copy the `stitched/` folder and add the following lines to the existing app's main file:
>
> ```js
> //[Stitched backend]
> const { stitchedDB } = require("./stitched/database");
>
> //[Routes]
> const stitchedRouter = require("./stitched/api");
> app.use("/api", stitchedRouter);
> ```

# Dependencies

1. Node.js 22.14.0
2. npm 10.1.0

The app may work with other versions, but these are the versions that were used during development.

# Database

See [Database](database.md) for detailed information.

# Installation

## Backend

1. Copy the contents of `backend/`.
2. Open a MongoDB project if you don't already have one.
3. Create a `.env` file in the root directory of the project and fill it with the following:

```bash
STITCHED_DBURL=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority
STITCHED_API=<custom API key>
```

4. Create a document in your MongoDB database according to the schema in [Defaults Schema](database.md#defaults-schema).
5. Run `npm i`.
6. Start `index.js`.

> [!IMPORTANT]
> For the app to work on mobile, the backend needs to be hosted on a server with a public URL.

## Frontend

1. Copy the contents of `frontend/`.
2. Create a `.env` file in the root directory of the project and fill it with the following:

```bash
VITE_API=<base url of the backend>
VITE_TOKEN=<backend custom API key>
```

3. Run `npm i`.

> [!NOTE]
> At this point you can run `npm start` or `ionic serve` to open the app in browser.

---

To run the app on mobile:

### Android

4. Install the package:

```
npm install @capacitor/android
```

5. Build the web app:

```
npm run build
```

6. Add the platform:

```
npx cap add android
```

7. Generate Android app icons and splash screens from the source images in the `resources/` directory:

```
npx capacitor-assets generate --android
```

8. Sync web assets and config:

```
npx cap sync android
```

9. Additional Setup: See [Android Setup](android_setup.md) for additional required changes to the Android project files.

10. Open in Android Studio:

```
npx cap open android
```

11. Build and run the app on your device.

### iOS

> [!IMPORTANT]
> The app was tested <ins>only</ins> on an **Android** 13+ device.

4. Install the package:

```
npm install @capacitor/ios
```

5. Build the web app:

```
npm run build
```

6. Add the platform:

```
npx cap add ios
```

7. Generate iOS app icons and splash screens from the source images in the `resources/` directory:

```
npx capacitor-assets generate --ios
```

8. Sync web assets and config:

```
npx cap sync ios
```

9. Additional setup: While I can provide the steps required to run the app on Android, I can’t provide their equivalents for iOS, as I don’t have the setup to test or verify them.<br>
   The manual changes applied on Android are:

   - Enabling `usesCleartextTraffic` in the manifest to allow HTTP connections.
   - Adding a `POST_NOTIFICATIONS` permission to the manifest.
   - Adding code to request notification permissions on app start.
   - Copying the notification icon (`resources/manual/ic_notif_icon.png`) to the resources folder.

10. Open in Xcode:

```
npx cap open ios
```

11. Build and run the app on your device.

# Usage

1. Configure your `Defaults` document in the database to suit your needs, and update it as required.
2. Use the app to keep track of your moments, memories and mementos.

# Future Plans

To summarize, the future plans for this app are:

- [ ] Rebuild the app from scratch, moving most of the logic to the backend.
- [ ] Migrate to Push Notifications.
- [ ] Improve documentation and provide more detailed usage instructions.
