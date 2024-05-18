"use client";

import { User } from "@supabase/auth-helpers-nextjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import StartStudyingButton from "./startStudyingButton";
import FinishStudyingButton from "./finishStudyingButton";
import { readLatestStudying } from "@/hooks/studies";
import { Autocomplete, Button, Grid, Skeleton, TextField } from "@mui/material";
import { CategoryType, OptionsCategoriesType } from "@/consts/categories.types";
import { readCategories } from "@/hooks/categories";
import { StudyDataType } from "@/consts/studies.types";

//fetcherの作成必要あり？

export const StudiesForm = ({
  user,
  studyingData,
  setStudyingData,
}: {
  user: User | null;
  studyingData: StudyDataType | null;
  setStudyingData: Dispatch<SetStateAction<StudyDataType[] | null>>
}) => {
  const [isStudying, setIsStudying] = useState<boolean | null>(null);
  const [studyCategory, setStudyCategory] = useState<number | null>(null);

  //カテゴリー呼び出し
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [options, setOptions] = useState<OptionsCategoriesType[]>([]);
  const [categoryLabel, setCategoryLabel] =
    useState<OptionsCategoriesType | null>(null);

  //カテゴリー追加ダイアログ
  const [isCategoryDialogOpened, setIsCategoryDialogOpened] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    //サインアップ後のエラーアラート防止でif (user)
    if (user) {
      readCategories(user.id, setCategories);
    }
  }, []);

  useEffect(() => {
    if (studyingData) {
      setIsStudying(true)
      setStudyCategory(studyingData.study_category)
    } else {
      setIsStudying(false)
    }
  }, [studyingData]);

  //カテゴリーのoptionsをフォーマット
  useEffect(() => {
    const options: OptionsCategoriesType[] = [];
    for (let i = 0; i < categories.length; i++) {
      options.push({
        id: categories[i].id,
        label: categories[i].category_name,
      });
      if (studyCategory === categories[i].id) {
        setCategoryLabel({
          id: categories[i].id,
          label: categories[i].category_name,
        });
      }
    }
    setOptions(options);
  }, [categories, studyCategory]);

  return (
    <>
      {categories ? (
        <Autocomplete
          options={options}
          value={categoryLabel}
          disabled={isStudying!}
          onChange={(event: any, newValue: OptionsCategoriesType | null) => {
            if (newValue) {
              setCategoryLabel({ id: newValue.id, label: newValue.label });
              setStudyCategory(newValue.id);
            } else {
              setCategoryLabel(null);
              setStudyCategory(null);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="カテゴリー"
              defaultValue={categoryLabel}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}
          size="small"
          sx={{ marginBottom: "8px" }}
        />
      ) : (
        <>カテゴリーがありません</>
      )}
      {/* <Button
        variant="text"
        component="span"
        onClick={() => setIsCategoryDialogOpened(true)}
        sx={{ fontSize: 10 }}
      >
        カテゴリーを追加
      </Button> */}

      {isStudying === null ? (
        <Skeleton variant="rounded" height={36.5} />
      ) : (
        <Grid container spacing={2} sx={{ marginBottom: "8px" }}>
          <Grid item xs={6}>
            <StartStudyingButton
              user={user}
              isStudying={isStudying}
              studyCategory={studyCategory}
              setStudyingData={setStudyingData}
            />
          </Grid>
          <Grid item xs={6}>
            <FinishStudyingButton
              user={user}
              isStudying={isStudying}
              id={studyingData?.id!}
              setStudyingData={setStudyingData}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

// "use client";

// import { User } from "@supabase/auth-helpers-nextjs";
// import { useEffect, useState } from "react";
// import StartStudyingButton from "./startStudyingButton";
// import FinishStudyingButton from "./finishStudyingButton";
// import { readLatestStudying } from "@/hooks/studies";
// import { Autocomplete, Button, Grid, Skeleton, TextField } from "@mui/material";
// import { CategoryType, OptionsCategoriesType } from "@/consts/categories.types";
// import { readCategories } from "@/hooks/categories";
// import { StudyDataType } from "@/consts/studies.types";

// //fetcherの作成必要あり？

// export const LatestStudiesListenerxxx = ({ user }: { user: User | null }) => {

//   const [studyingData, setStudyingData] = useState<StudyDataType[] | null>(null);
//     const [isStudying, setIsStudying] = useState<boolean | null>(null);
//   const [studyCategory, setStudyCategory] = useState<number | null>(null);

//   //カテゴリー呼び出し
//   const [categories, setCategories] = useState<CategoryType[]>([]);
//   const [options, setOptions] = useState<OptionsCategoriesType[]>([]);
//   const [categoryLabel, setCategoryLabel] =
//     useState<OptionsCategoriesType | null>(null);

//   //カテゴリー追加ダイアログ
//   const [isCategoryDialogOpened, setIsCategoryDialogOpened] =
//     useState<boolean>(false);

//   const [loading, setLoading] = useState<boolean>(false);
//   const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

//   useEffect(() => {
//     //サインアップ後のエラーアラート防止でif (user)
//     if (user) {
//       readCategories(user.id, setCategories);
//       readLatestStudying(user?.id!, setStudyingData);
//     }
//   }, []);

//   useEffect(() => {
//     setIsStudying()
//   }, [studyingData]);

//   //カテゴリーのoptionsをフォーマット
//   useEffect(() => {
//     const options: OptionsCategoriesType[] = [];
//     for (let i = 0; i < categories.length; i++) {
//       options.push({
//         id: categories[i].id,
//         label: categories[i].category_name,
//       });
//     }
//     setOptions(options);
//   }, [categories]);

//   return (
//     <>
//       {categories ? (
//         <Autocomplete
//           options={options}
//           value={categoryLabel}
//           onChange={(event: any, newValue: OptionsCategoriesType | null) => {
//             if (newValue) {
//               setCategoryLabel({ id: newValue.id, label: newValue.label });
//               setStudyCategory(newValue.id);
//             } else {
//               setCategoryLabel(null);
//               setStudyCategory(null);
//             }
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="カテゴリー"
//               defaultValue={categoryLabel}
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//             />
//           )}
//           size="small"
//         />
//       ) : (
//         <>カテゴリーがありません</>
//       )}
//       <Button
//         variant="text"
//         component="span"
//         onClick={() => setIsCategoryDialogOpened(true)}
//         sx={{ fontSize: 10 }}
//       >
//         カテゴリーを追加
//       </Button>

//       {isStudying === null ? (
//         <Skeleton variant="rounded" height={36.5} />
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <StartStudyingButton
//               user={user}
//               isStudying={isStudying}
//               setIsStudying={setIsStudying}
//               studyCategory={studyCategory}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <FinishStudyingButton
//               user={user}
//               isStudying={isStudying}
//               setIsStudying={setIsStudying}
//             />
//           </Grid>
//         </Grid>
//       )}
//     </>
//   );
// };
