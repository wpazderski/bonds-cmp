import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { TabPanel } from "../../common/tabPanel/TabPanel";
import { Bonds } from "../bonds/Bonds";
import { Charts } from "../charts/Charts";
import { setBonds, setSettings, useAppDispatch, useAppSelector } from "../../../app/store";
import { selectOpenTabId, setOpenTabId, AppMainTabs } from "../../../app/store/UiSlice";
import { Settings } from "../settings/Settings";
import { ExportImport } from "../exportImport/ExportImport";
import { ExportImport as ExportImportUtils } from "../../../app/store/ExportImport";
import "./App.scss";
import { LanguageSelector } from "./languageSelector/LanguageSelector";

const settingsTabId: AppMainTabs = "settings";
const bondsTabId: AppMainTabs = "bonds";
const chartsTabId: AppMainTabs = "charts";
const exportImportTabId: AppMainTabs = "exportImport";

function App() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const openTabId = useAppSelector(selectOpenTabId);
    const handleChange = (_event: React.SyntheticEvent, newSelectedTab: AppMainTabs) => {
        dispatch(setOpenTabId(newSelectedTab));
    };
    useEffect(() => {
        document.title = t("appTitle");
    }, [t]);
    useEffect(() => {
        ExportImportUtils.ensureInitialized(data => {
            dispatch(setSettings(data.settings));
            dispatch(setBonds(data.bonds));
        });
    });
    
    return (
        <div className="App">
            <LanguageSelector />
            <header className="App-header">
                <h1>{t("appTitle")}</h1>
            </header>
            <div className="App-content">
                <Box>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
                        <Tabs value={openTabId} onChange={handleChange}>
                            <Tab label={t("mainTabs.header.settings")} value={settingsTabId} />
                            <Tab label={t("mainTabs.header.bonds")} value={bondsTabId} />
                            <Tab label={t("mainTabs.header.charts")} value={chartsTabId} />
                            <Tab label={t("mainTabs.header.exportImport")} value={exportImportTabId} />
                        </Tabs>
                    </Box>
                    <TabPanel isOpen={openTabId === settingsTabId}>
                        <Settings />
                    </TabPanel>
                    <TabPanel isOpen={openTabId === bondsTabId}>
                        <Bonds />
                    </TabPanel>
                    <TabPanel isOpen={openTabId === chartsTabId}>
                        <Charts />
                    </TabPanel>
                    <TabPanel isOpen={openTabId === exportImportTabId}>
                        <ExportImport />
                    </TabPanel>
                </Box>
            </div>
        </div>
    );
}

export default App;
