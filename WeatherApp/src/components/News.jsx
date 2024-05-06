import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";

const News = () => {
  const [news, setNews] = useState([]);
  const [storyLimit, setStoryLimit] = useState(5);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${
            import.meta.env.VITE_NEW_YORK_TIMES_API_KEY
          }`
        );
        const data = await response.json();
        setNews(data.results.slice(0, storyLimit));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, [storyLimit]);

  return (
    <Box px={5} py={2}>
      <Typography variant="h2" mb={2} sx={{ textAlign: "center" }}>
        Top News
      </Typography>
      <Box display="flex" flexWrap="wrap">
        {news.map((story, index) => (
          <Card key={index} sx={{ m: 1, width: "calc(50% - 16px)" }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {story.title}
              </Typography>
              <Typography variant="body1">{story.abstract}</Typography>
              <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
                {story.byline}
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box mb={1} style={{ maxWidth: "100%" }}>
                  <img
                    src={story.multimedia[1].url}
                    alt="newsimage"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography variant="subtitle2">
                  {story.multimedia[1].caption}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                href={story.url}
                target="_blank"
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" onClick={() => setStoryLimit(Math.min(storyLimit + 5, 20))}>
          Load More
        </Button>
      </Box>
    </Box>
  );
};

export default News;
