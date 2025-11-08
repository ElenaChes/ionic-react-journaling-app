import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import { Capacitor } from "@capacitor/core";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/styles/base.css";
import "./theme/styles/buttons.css";
import "./theme/styles/forms.css";
import "./theme/styles/layout.css";
import "./theme/styles/modals.css";
import "./theme/styles/typography.css";

//[Imports]
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
//[Import visuals]
import { book, albums } from "ionicons/icons";
//[Import components]
import Journal from "./pages/Journal";
import History from "./pages/History";
//[Import data]
import { AppContextProvider } from "./context/Context";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lock({ orientation: "portrait" });
      } catch (error) {
        console.warn("Failed to lock orientation", error);
      }
    };
    lockOrientation();
  }, []);

  return (
    <IonApp>
      <AppContextProvider>
        <IonReactRouter>
          <IonTabs>
            {/* Tabs */}
            <IonRouterOutlet>
              {/* Journal Tab */}
              <Redirect exact path="/" to="/journal" />
              <Route exact path="/journal">
                <Journal />
              </Route>
              {/* History Tab */}
              <Route exact path="/history">
                <History />
              </Route>
            </IonRouterOutlet>

            {/* Top Bar */}
            <IonTabBar color="primary" slot="top">
              {/* Journal Button */}
              <IonTabButton tab="journal" href="/journal">
                <IonIcon icon={book} />
                <IonLabel>Journal</IonLabel>
              </IonTabButton>
              {/* History Button */}
              <IonTabButton tab="history" href="/history">
                <IonIcon icon={albums} />
                <IonLabel>History</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </AppContextProvider>
    </IonApp>
  );
};

export default App;
