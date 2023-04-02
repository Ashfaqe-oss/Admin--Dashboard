import React from "react";
import Header from "../../components/Header";
import FlexBetween from "../../components/FlexBetween";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const index = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header
          title="Welcome to ECOMVISION"
          subtitle="You are logged in as Admin"
        />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.neutral,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "20px 30px",
            }}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <PointOfSale sx={{ mr: "10px" }} />
            Go to Dashboard
          </Button>
        </Box>
      </FlexBetween>
    </Box>
  );
};

export default index;
