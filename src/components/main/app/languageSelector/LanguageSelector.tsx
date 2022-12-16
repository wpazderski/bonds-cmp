import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { GB, PL, US } from "country-flag-icons/react/3x2";
import "./LanguageSelector.scss";
import { defaultLang, availableLangs } from "../../../../app/i18n";
import i18next from "i18next";

function getCurrentLang(): string {
    const lang = localStorage.getItem("i18nextLng");
    if (!lang) {
        return defaultLang;
    }
    return availableLangs.includes(lang) ? lang : defaultLang;
}

export function LanguageSelector() {
    const [currentLang, setCurrentLang] = useState(getCurrentLang());
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleMainButtonClick = (target: HTMLElement) => {
        setAnchorEl(target);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const setLang = (lang: string) => {
        localStorage.setItem("i18nextLng", lang);
        setCurrentLang(lang);
        i18next.changeLanguage(lang);
    };
    return (
        <div className="LanguageSelector">
            <div className="LanguageSelector__main-button"  onClick={event => handleMainButtonClick(event.currentTarget)}>
                <div style={{ display: currentLang === "en" ? "block" : "none" }} className="LanguageSelector__combined-icon">
                    <US />
                    <GB />
                </div>
                <div style={{ display: currentLang === "pl" ? "block" : "none" }}>
                    <PL />
                </div>
            </div>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                onClick={handleClose}
                disableScrollLock
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: "''",
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 10,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                        "svg": {
                            border: "1px solid #333",
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem selected={currentLang === "en"} onClick={() => setLang("en")}>
                    <ListItemIcon className="LanguageSelector__combined-icon">
                        <US />
                        <GB />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem selected={currentLang === "pl"} onClick={() => setLang("pl")}>
                    <ListItemIcon>
                        <PL />
                    </ListItemIcon>
                </MenuItem>
            </Menu>
            {/* <ul>
                <li><GB /></li>
                <li><US /></li>
                <li><PL /></li>
            </ul> */}
        </div>
    );
}
