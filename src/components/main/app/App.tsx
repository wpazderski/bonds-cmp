import "./App.scss";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { setBonds, setSettings, useAppDispatch, useAppSelector } from "../../../app/store";
import { ExportImport as ExportImportUtils } from "../../../app/store/ExportImport";
import { AppMainTabs, selectOpenTabId, setOpenTabId } from "../../../app/store/UiSlice";
import { TabPanel } from "../../common/tabPanel/TabPanel";
import { Bonds } from "../bonds/Bonds";
import { Charts } from "../charts/Charts";
import { ExportImport } from "../exportImport/ExportImport";
import { Settings } from "../settings/Settings";
import { LanguageSelector } from "./languageSelector/LanguageSelector";





const settingsTabId: AppMainTabs = "settings";
const bondsTabId: AppMainTabs = "bonds";
const chartsTabId: AppMainTabs = "charts";
const exportImportTabId: AppMainTabs = "exportImport";

function App() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const openTabId = useAppSelector(selectOpenTabId);
    
    const handleChange = useCallback((_event: React.SyntheticEvent, newSelectedTab: AppMainTabs) => {
        dispatch(setOpenTabId(newSelectedTab));
    }, [dispatch]);
    
    useEffect(() => {
        document.title = t("appTitle");
    }, [t]);
    
    useEffect(() => {
        const data = ExportImportUtils.readDataFromUrlOrLocalStorage();
        if (data) {
            dispatch(setSettings(data.settings));
            dispatch(setBonds(data.bonds));
        }
    }, [dispatch]);
    
    return (
        <div className="App">
            <LanguageSelector />
            <header className="App-header">
                <h1>{t("appTitle")}</h1>
            </header>
            <div className="App-content">
                <Box>
                    <Box className="disclaimer">
                        {t("disclaimer")}
                    </Box>
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
