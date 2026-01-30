"use client"; // Required for useState
import React, { useEffect, useState } from 'react';
import DashboardCard from '../_components/dashboardCard';
import ShopInfo from '../_components/shopInfo';
import BusinnessInfo from '../_components/businnessInfo';
import ShippinInfo from '../_components/shippinInfo';
import PaymentInfo from '../_components/paymentInfo';
import DocumentInfo from '../_components/documentInfo';


const Page = () => {
  const [activeId, setActiveId] = useState("#shop-info");
  console.log("activeId: ", activeId);
  const sections = [
    { id: "#shop-info", component: <ShopInfo /> },
    { id: "#business-info", component: <BusinnessInfo /> },
    { id: "#shipping-info", component: <ShippinInfo /> },
    { id: "#payment-info", component: <PaymentInfo/> },
    { id: "#document-info", component: <DocumentInfo/> },
    // Add more here easily
  ];



  return (
    <div className='w-full flex flex-col px-5'>
      {/* Pass the setter function to your sidebar/tabs */}
      <DashboardCard setActiveId={setActiveId} activeId={activeId} />

      <div className="mt-5 max-w-4xl w-full mx-auto">
        {sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id.replace(/^\/#/, '')}
            className={`${activeId === sec.id ? "block" : "hidden"} w-full flex flex-col gap-4`}
          >
            {sec.component}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Page;