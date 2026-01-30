
const url_endpoint = `${process.env.NEXT_PUBLIC_API_URL}`;
export const getBrandsData = async () => {
 try {
     const response = await fetch(`${url_endpoint}/v1/brands`, {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json',
         },
     })
     const data = await response.json()
     return data
 } catch (error) {
     console.log(error)
     throw error
 }
}