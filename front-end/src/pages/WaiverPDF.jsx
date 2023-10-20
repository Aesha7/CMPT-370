import React from "react";
import { Document, Page } from "react-pdf";
import samplePDF from './WaiverForm.pdf'
import { useState } from "react";


const WaiverPDF = () =>{


    return (
        <embed src="./WaiverForm.pdf" width="800px" height="1000px" />
        // <object data= 
        // "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf" 
        //                 width="800"
        //                 height="500"> 
        //         </object>
        // <Document file={samplePDF}>
        //     <Page pageNumber={1}/>
        // </Document>
      //   <div>
      //   <Document
      //     file="Waiver_Form.pdf" // Replace with the path to your PDF file
      //     onLoadSuccess={onDocumentLoadSuccess}
      //   >
      //     <Page pageNumber={pageNumber} />
      //   </Document>
      //   <p>
      //     Page {pageNumber} of {numPages}
      //   </p>
      // </div>

        
    );
} 
export default WaiverPDF;