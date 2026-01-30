import React, {  useEffect, useState } from 'react'
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';

const ImageUpload = ({setImage,name}:{setImage:any,name:string}) => {
    const [resource, setResource] = useState<any | undefined>();


    

  return (
      <CldUploadWidget
          signatureEndpoint="/api/cloudinary"
          uploadPreset="eshop"
          options={
            {
                folder:"eshop",
                maxFiles:10,
                showUploadMoreButton:true,
                multiple:true,
                maxFileSize:1024*1024*10,

            }
          }
          onSuccess={(result, { widget }) => {
            console.log('result', result);
             
              setResource(result?.info);  // { public_id, secure_url, etc }
              setImage(result?.info);
          }}
          onQueuesEnd={(result, { widget }) => {

              widget.close();
          }}
      >
          {({ open }) => {
              function handleOnClick() {
                  setResource(undefined);
                  open();
              }
              return (
                  <button onClick={handleOnClick}
                  type='button'
                  >
                      {name}
                  </button>
              );
          }}
      </CldUploadWidget>  )
}

export default ImageUpload