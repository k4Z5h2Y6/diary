import FoodEditor from "@/components/foods/foodEditor";
import FoodForm from "@/components/foods/foodForm";
import { Database } from "@/consts/database.types";
import { FoodDataType } from "@/consts/foods.types";
import { Container } from "@mui/material";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useParams } from "next/navigation";

export default async function Page() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <FoodEditor user={user}/> */}
      </Container>
    </>
  );
}

// // "use client";

// import FoodForm from "@/components/foods/foodForm";
// import { Database } from "@/consts/database.types";
// import { FoodDataType } from "@/consts/foods.types";
// import { readFood } from "@/hooks/foods";
// import { Container } from "@mui/material";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default async function Page() {

//   const supabase = createServerComponentClient<Database>({ cookies });
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const params = useParams()
//   const [foodData, setFoodData] = useState<FoodDataType[] | null>(null)

//   useEffect(() => {
//     if (params.id) {
//       readFood(Number(params.id), setFoodData)
//     }
//   },[])

//   return (
//     <>
//       <Container
//         maxWidth="md"
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <FoodForm user={user} foodData={foodData}/>
//       </Container>
//     </>
//   );
// }
