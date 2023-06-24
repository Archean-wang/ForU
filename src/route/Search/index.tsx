import { Box, Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import React from "react";
import SearchSongs from "./Song";



function Search() {
    const params = useParams();
    const [value, setValue] = React.useState(0);
    function handleChange(event: React.SyntheticEvent, newValue: number) {
        console.log(newValue)
        setValue(newValue);
    }
    return (
        <Box sx={{
            height: "100%"
        }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Item One" />
                <Tab label="Item Two" />
                <Tab label="Item Three" />
            </Tabs>
            {value === 0 && <SearchSongs ></SearchSongs>}
        </Box>
    )
}


export default Search