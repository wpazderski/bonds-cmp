import Box from "@mui/material/Box";

export interface TabPanelProps {
    children?: React.ReactNode;
    isOpen: boolean;
}

export function TabPanel(props: TabPanelProps) {
    const { children, isOpen, ...otherProps } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={!isOpen}
            {...otherProps}
        >
            {isOpen && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
