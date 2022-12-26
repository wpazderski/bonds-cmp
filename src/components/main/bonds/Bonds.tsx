import Grid from "@mui/material/Unstable_Grid2";

import { selectAvailableBonds, useAppSelector } from "../../../app/store";
import { selectOpenBondsId } from "../../../app/store/UiSlice";
import { BondsForm } from "./bondsForm/BondsForm";
import { BondsList } from "./bondsList/BondsList";





export function Bonds() {
    const availableBonds = useAppSelector(selectAvailableBonds);
    const openBondsId = useAppSelector(selectOpenBondsId);
    const bonds = availableBonds.find(bonds => bonds.id === openBondsId);
    
    return (
        <div className="Bonds">
            <Grid container spacing={8}>
                <Grid xs={4}>
                    <BondsList />
                </Grid>
                <Grid xs={8}>
                    {bonds && <BondsForm bonds={bonds} />}
                </Grid>
            </Grid>
        </div>
    );
}
