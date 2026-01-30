import React, { use, useEffect } from 'react'
import { useState } from 'react'
import {CldUploadWidget} from "next-cloudinary"


interface Props {
  setImage: React.SetStateAction<any>;
  name: string;
  icon: React.ReactNode;
  images: {url:string,public_id:string}[];
}

const multiImageUpload = ({ images,setImage, name, icon }: Props) => {
  const [resource, setResource] = useState<any | undefined>();


  console.log("resource: ", resource);
  console.log("images: ", images);

  useEffect(() => {
    if (resource) {
      console.log("resource.secure_url: ", resource.secure_url);
        setImage([...images, {url:resource.secure_url,public_id:resource.public_id}])
    }
  }, [resource])

    

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
                  className='flex items-center gap-2'
                  >
                      {name}{icon}
                  </button>
              );
          }}
      </CldUploadWidget> 
  )
}

export default multiImageUpload