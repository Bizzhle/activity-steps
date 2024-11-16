import {
  Box,
  Toolbar,
  Breadcrumbs,
  Typography,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useActivities } from "../../utils/contexts/ActivityContext";
import ActivityCard from "../Card";

export default function CategoryDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { categoryName } = useParams<{ categoryName: string }>();
  const { activities } = useActivities();

  return (
    <Container>
      {!isMobile && <Toolbar />}
      <Box mb={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Activities
          </Link>
          <Link
            to="/categories"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Categories
          </Link>
          <Typography color="text.primary">{categoryName}</Typography>
        </Breadcrumbs>
      </Box>

      {activities.length === 0 ? (
        <Typography>No activities found for this category.</Typography>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {activities.map((activity, index) => (
            <Grid item xs={12} sm={12} key={index}>
              <ActivityCard value={activity} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}