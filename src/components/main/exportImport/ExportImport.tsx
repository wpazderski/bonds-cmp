import "./ExportImport.scss";

import { faCopy, faDownload, faSave, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { selectBonds, selectSettings, setBonds, setSettings, useAppDispatch, useAppSelector } from "../../../app/store";
import { ExportImport as ExportImportUtils } from "../../../app/store/ExportImport";





export function ExportImport() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [successSnackbarText, setSuccessSnackbarText] = useState("");
    const settings = useAppSelector(selectSettings);
    const bonds = useAppSelector(selectBonds);
    
    const getDataForExport = useCallback(() => {
        return {
            bonds: bonds,
            settings: settings,
        };
    }, [bonds, settings]);
    
    const sharedUrl = useMemo(() => {
        return ExportImportUtils.exportToUrl(getDataForExport());
    }, [getDataForExport]);
    
    const handleSuccessSnackbarClose = useCallback(() => {
        setSuccessSnackbarText("");
    }, []);
    
    const handleSaveDataClick = useCallback(() => {
        ExportImportUtils.saveDataToLocalStorage(getDataForExport());
        setSuccessSnackbarText(t("exportImport.save.messages.saved"));
    }, [getDataForExport, t]);
    
    const handleClearDataClick = useCallback(() => {
        ExportImportUtils.removeDataFromLocalStorage();
        setSuccessSnackbarText(t("exportImport.save.messages.cleared"));
    }, [t]);
    
    const handleExportDataClick = useCallback(() => {
        ExportImportUtils.exportToFile(getDataForExport());
        setSuccessSnackbarText(t("exportImport.export.messages.exported"));
    }, [getDataForExport, t]);
    
    const handleImportFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length !== 1) {
            return;
        }
        const data = await ExportImportUtils.readFromFile(files[0]);
        dispatch(setSettings(data.settings));
        dispatch(setBonds(data.bonds));
        setSuccessSnackbarText(t("exportImport.import.messages.imported"));
    }, [dispatch, t]);
    
    const handleCopyUrlClick = useCallback(() => {
        navigator.clipboard.writeText(sharedUrl);
        setSuccessSnackbarText(t("exportImport.share.messages.copied"));
    }, [sharedUrl, t]);
    
    return (
        <div className="ExportImport">
            <section>
                <h3>{t("exportImport.save")}</h3>
                <div className="ExportImport__info">{t("exportImport.save.info")}</div>
                <div className="ExportImport__buttons">
                    <Button
                        variant="contained"
                        startIcon={<FontAwesomeIcon icon={faSave} />}
                        onClick={handleSaveDataClick}
                        sx={{ margin: "10px 10px 10px 0" }}
                    >
                        {t("exportImport.save.buttons.save")}
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={handleClearDataClick}
                        sx={{ margin: "10px 10px 10px 0" }}
                    >
                        {t("exportImport.save.buttons.clear")}
                    </Button>
                </div>
            </section>
            <section>
                <h3>{t("exportImport.export")}</h3>
                <div className="ExportImport__info">{t("exportImport.export.info")}</div>
                <div className="ExportImport__buttons">
                    <Button
                        variant="contained"
                        startIcon={<FontAwesomeIcon icon={faDownload} />}
                        onClick={handleExportDataClick}
                        sx={{ margin: "10px 10px 10px 0" }}
                    >
                        {t("exportImport.export.buttons.export")}
                    </Button>
                </div>
            </section>
            <section>
                <h3>{t("exportImport.import")}</h3>
                <div className="ExportImport__info">{t("exportImport.import.info")}</div>
                <div className="ExportImport__buttons">
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<FontAwesomeIcon icon={faUpload} />}
                        sx={{ margin: "10px 10px 10px 0" }}
                    >
                        {t("exportImport.import.buttons.import")}
                        <input
                            type="file"
                            hidden
                            onChange={handleImportFileChange}
                        />
                    </Button>
                </div>
            </section>
            <section>
                <h3>{t("exportImport.share")}</h3>
                <div className="ExportImport__info">{t("exportImport.share.info")}</div>
                <div className="ExportImport__buttons">
                    <Button
                        variant="contained"
                        startIcon={<FontAwesomeIcon icon={faCopy} />}
                        onClick={handleCopyUrlClick}
                        sx={{ margin: "10px 10px 10px 0" }}
                    >
                        {t("exportImport.share.buttons.copy")}
                    </Button>
                    <div>
                        <TextField
                            multiline
                            rows={10}
                            value={sharedUrl}
                            sx={{ margin: "10px 10px 10px 0", width: "100%" }}
                        />
                    </div>
                </div>
            </section>
            <Snackbar open={!!successSnackbarText} autoHideDuration={5000} onClose={handleSuccessSnackbarClose}>
                <Alert onClose={handleSuccessSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    {successSnackbarText}
                </Alert>
            </Snackbar>
        </div>
    );
}
