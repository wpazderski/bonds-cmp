import "./BondsList.scss";

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
    addAvailableBonds,
    removeAvailableBonds,
    selectAvailableBonds,
    useAppDispatch,
    useAppSelector,
} from "../../../../app/store";
import { selectOpenBondsId, setOpenBondsId } from "../../../../app/store/UiSlice";





export function BondsList() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const availableBonds = useAppSelector(selectAvailableBonds);
    const openBondsId = useAppSelector(selectOpenBondsId);
    
    useEffect(() => {
        if (availableBonds.length > 0 && !availableBonds.find(bonds => bonds.id === openBondsId)) {
            dispatch(setOpenBondsId(availableBonds[0].id));
        }
    }, [availableBonds, dispatch, openBondsId]);
    
    const handleAddBondsClick = useCallback(() => {
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
    }, [dispatch]);
  
    return (
        <div className="BondsList">
            <List>
                {availableBonds.map(bonds => (
                    <BondsListItem
                        key={bonds.id}
                        id={bonds.id}
                        name={bonds.name}
                        isSelected={openBondsId === bonds.id}
                    />
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton role={undefined} onClick={handleAddBondsClick}>
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

interface BondsListItemProps {
    id: string;
    name: string;
    isSelected: boolean;
}

function BondsListItem(props: BondsListItemProps) {
    const dispatch = useAppDispatch();
    
    const handleBondsClick = useCallback(() => {
        dispatch(setOpenBondsId(props.id));
    }, [dispatch, props.id]);
    
    const handleRemoveBondsClick = useCallback(() => {
        dispatch(removeAvailableBonds(props.id));
    }, [dispatch, props.id]);
    
    return (
        <ListItem
            key={props.id}
            secondaryAction={
                <IconButton edge="end" onClick={handleRemoveBondsClick}>
                    <FontAwesomeIcon icon={faTrash} className="BondsList__item-icon" />
                </IconButton>
            }
            disablePadding
        >
            <ListItemButton role={undefined} onClick={handleBondsClick} selected={props.isSelected}>
                <ListItemText primary={props.name} />
            </ListItemButton>
        </ListItem>
    );
}
