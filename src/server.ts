import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, checkURLFormat} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // /filteredimage?image_url="https//..."
  // filters an image from URL
  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      const { image_url } = req.query;
      // check image_url exists
      if(!image_url)
        res.status(400).send({ message: "Image_URL not found"});
      // check correct format 
      if(checkURLFormat(image_url))
        res.status(415).send({ message: "Unsupported media type. Accepted formats are: .jpg, .jpeg or .png "});

      const filteredpath = await filterImageFromURL(image_url);
      res.status(200).sendFile(filteredpath, async () => await deleteLocalFiles([filteredpath]) );

    } catch (error) {
      res.status(500).send({ message: "Server error"})
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();