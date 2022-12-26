import "./LanguageSelector.scss";

import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GB, PL, US } from "country-flag-icons/react/3x2";
import i18next from "i18next";
import { useCallback, useState } from "react";

import { availableLangs, defaultLang } from "../../../../app/i18n";





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
    
    const handleMainButtonClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);
    
    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);
    
    const handleMenuClick = useCallback(() => {
        setAnchorEl(null);
    }, []);
    
    const setLang = useCallback((lang: string) => {
        localStorage.setItem("i18nextLng", lang);
        setCurrentLang(lang);
        i18next.changeLanguage(lang);
    }, []);
    
    const handleChangeLangEn = useCallback(() => {
        setLang("en");
    }, [setLang]);
    
    const handleChangeLangPl = useCallback(() => {
        setLang("pl");
    }, [setLang]);
    
    return (
        <div className="LanguageSelector">
            <div className="LanguageSelector__main-button"  onClick={handleMainButtonClick}>
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
                onClose={handleMenuClose}
                onClick={handleMenuClick}
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
                <MenuItem selected={currentLang === "en"} onClick={handleChangeLangEn}>
                    <ListItemIcon className="LanguageSelector__combined-icon">
                        <US />
                        <GB />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem selected={currentLang === "pl"} onClick={handleChangeLangPl}>
                    <ListItemIcon>
                        <PL />
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </div>
    );
}
