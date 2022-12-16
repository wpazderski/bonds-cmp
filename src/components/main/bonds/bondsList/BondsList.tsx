import { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { addAvailableBonds, removeAvailableBonds, selectAvailableBonds, useAppDispatch, useAppSelector } from "../../../../app/store";
import { selectOpenBondsId, setOpenBondsId } from "../../../../app/store/UiSlice";
import "./BondsList.scss";

export function BondsList() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const availableBonds = useAppSelector(selectAvailableBonds);
    const openBondsId = useAppSelector(selectOpenBondsId);
    const handleBondsClick = (bondsId: string) => {
        dispatch(setOpenBondsId(bondsId));
    };
    const handleRemoveBondsClick = (bondsId: string) => {
        dispatch(removeAvailableBonds(bondsId));
    };
    const handleAddBondsClick = () => {
        const newBondsId = Date.now().toString();
        dispatch(addAvailableBonds({
            id: newBondsId,
            name: "Bonds",
            unitPrice: 100,
            capitalization: false,
            interestPeriods: [
                {
                    id: Date.now().toString(),
                    repeats: 1,
                    duration: { num: 1, unit: "y" },
                    interestRate: { additivePercent: 7.25, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 2.00, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: true, limitedToTotalInterest: true },
                },
            ],
        }));
        dispatch(setOpenBondsId(newBondsId));
    };
    useEffect(() => {
        if (availableBonds.length > 0 && !availableBonds.find(bonds => bonds.id === openBondsId)) {
            dispatch(setOpenBondsId(availableBonds[0].id));
        }
    }, [availableBonds, dispatch, openBondsId]);
  
    return (
        <div className="BondsList">
            <List>
                {availableBonds.map(bonds => {
                    return (
                        <ListItem
                            key={bonds.id}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemoveBondsClick(bonds.id)}>
                                    <FontAwesomeIcon icon={faTrash} className="BondsList__item-icon" />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={() => handleBondsClick(bonds.id)} selected={openBondsId === bonds.id}>
                                <ListItemText primary={bonds.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton role={undefined} onClick={() => handleAddBondsClick()}>
                        <ListItemIcon style={{minWidth:"28px"}}>
                            <FontAwesomeIcon icon={faPlus} className="BondsList__item-icon" />
                        </ListItemIcon>
                        <ListItemText primary={t("bondsList.addItem")} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
}
