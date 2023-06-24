import { Avatar, Box, TextField } from "@mui/material"


function Daily() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: 4
            }}
        >
            <Box sx={{
                display: "flex",
                gap: 4
            }}>
                <Box sx={{
                    height: 200,
                    width: 160,
                    bgcolor: "red",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4
                }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            height: 160,
                            width: 160,
                        }}></Avatar>
                </Box>
            </Box>
        </Box>
    )
}

export default Daily;