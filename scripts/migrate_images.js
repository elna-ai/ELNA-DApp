import { exec } from "child_process";

export const CONVERTOR = [
  { id: "9166d555-9555-45d5-b37b-4833d6147bda", image: "avatar_01.webp" },
  { id: "ba2f964c-b98c-4976-a410-90d097673fe7", image: "avatar_02.webp" },
  { id: "6729deda-d05c-4946-980c-8a8b70657dcf", image: "avatar_03.webp" },
  { id: "a64eb55b-71bf-44a7-8643-dc7a329d951b", image: "avatar_04.webp" },
  { id: "0bcba51b-2f2f-482b-928f-f70d3a6416de", image: "avatar_05.webp" },
  { id: "5f398c06-e010-4f04-bf66-198a8f3f4556", image: "avatar_06.webp" },
  { id: "c2cfbbfd-bbad-4e29-b5dc-62edd1f9f251", image: "avatar_07.webp" },
  { id: "dfb04849-53e2-43a0-878b-ae698d3f58bb", image: "avatar_08.webp" },
  { id: "0f9f92cd-8557-44eb-b3d0-3f4751e5ad3c", image: "avatar_09.webp" },
  { id: "0a2fb98c-65fd-41f0-bef1-917e415a1141", image: "avatar_10.webp" },
  { id: "65309c94-8415-4ea1-a860-6cb1460b49c5", image: "01.png" },
  { id: "78ad6124-6be0-45ef-8707-8c5c3f4b4c58", image: "02.png" },
  { id: "a927c46b-4081-4b7c-9f61-a2737a09bd17", image: "03.png" },
  { id: "b0c410bb-a423-48fe-8ec6-d04607d78db5", image: "04.png" },
  { id: "023b39d1-e7f5-40b2-8fd0-4bfdf9dcebe9", image: "05.png" },
  { id: "31bcd2bf-a4a6-43b7-b072-cdbb551f1c0e", image: "06.png" },
  { id: "04de01fa-5315-4455-88a6-cfe1d55e964a", image: "07.png" },
  { id: "956c5fba-3d33-4414-9e95-34aeb429b0e5", image: "08.png" },
  { id: "0d52340b-27ff-4b0a-b61b-040c2ed01700", image: "09.png" },
  { id: "943eafcb-50cb-4a07-a79b-4dc08ac3603c", image: "10.png" },
  { id: "bf1e00ab-caf7-409a-b421-d9ceae8eefd4", image: "11.png" },
  { id: "2606610a-c40b-4a1f-92b1-acfc802c916a", image: "12.png" },
  { id: "c5baa6bd-fad5-4612-baff-e543b3992197", image: "13.png" },
  { id: "b144f846-264d-468d-b296-10a712137087", image: "14.png" },
  { id: "74979b95-3693-4630-8066-4a68f8ad642b", image: "15.png" },
  { id: "fa1c865b-701c-4fde-8fd6-34fc1555864a", image: "avatar_11.webp" },
  { id: "c7b20123-44d9-4ccf-bedb-4498811c2580", image: "avatar_12.webp" },
  { id: "7ab719ea-b669-4366-be3d-62ac7638930d", image: "avatar_13.webp" },
  { id: "6753e168-e644-4844-adba-eee4338db493", image: "avatar_14.webp" },
  { id: "fdd85656-a5ab-4c7c-93cb-1547df376d67", image: "avatar_15.webp" },
  { id: "a6bc4cb1-da29-4530-b5ca-e8de69511f31", image: "avatar_16.webp" },
  { id: "c856b9c1-c0c0-420a-b8c4-3f31989aa42d", image: "avatar_17.webp" },
  { id: "31a4a782-a99e-45ea-93b6-bcd9aa6c43e1", image: "avatar_18.webp" },
  { id: "44704eaf-650e-4fa7-a4ab-3dc37443d88d", image: "avatar_19.webp" },
  { id: "220cffc5-645a-48ea-98fe-739c183f30f6", image: "avatar_20.webp" },
  { id: "773f3593-5edd-44ec-878e-05e1426a6fe6", image: "avatar_21.webp" },
  { id: "ab20b884-2f94-4f64-a747-b38c33eb7c28", image: "avatar_22.webp" },
  { id: "d215dbcb-944a-4a5e-af9e-5f787f4916d1", image: "avatar_23.webp" },
  { id: "f4672813-0151-4624-92d3-797e990066ee", image: "avatar_24.webp" },
  { id: "58877ddd-fda7-4e01-afa0-6e862a410359", image: "avatar_25.webp" },
  { id: "e1925025-01f0-4e2e-aaa5-92f31b59c188", image: "avatar_26.webp" },
  { id: "75e47d4c-31f2-4b9f-9b9a-af16d06216c3", image: "avatar_27.webp" },
  { id: "1594dfc8-079d-46ae-9efe-26c91d3b1e65", image: "avatar_28.webp" },
  { id: "1b713e14-c5bb-40a9-a6a2-27d947f4314b", image: "avatar_29.webp" },
  { id: "3702903d-0bcb-44ab-958c-d696e66ba598", image: "avatar_30.webp" },
  { id: "dc6fa701-81a9-4725-9a70-2aabab7f676e", image: "avatar_31.webp" },
  { id: "dc13e731-714d-42b9-a8c6-49b5adb97b62", image: "avatar_32.webp" },
  { id: "a4352974-b7a1-4b12-a8b2-b49be0f3a6d1", image: "avatar_33.webp" },
  { id: "744b5aa2-97e8-4769-8a20-dda52a42f11e", image: "avatar_34.webp" },
  { id: "02dc6323-6291-4471-b976-a661d0e85075", image: "avatar_35.webp" },
  { id: "cf8a753f-334a-46e1-9745-f1d381124b6d", image: "avatar_36.webp" },
  { id: "5d0e05cf-cdad-44c4-a4a1-f668d1403215", image: "avatar_37.webp" },
  { id: "f1216fc9-6c05-4f6e-a4ff-ded0dd08c402", image: "avatar_38.webp" },
  { id: "4fd6d466-61e0-46dc-a341-9c6b7a6e9da9", image: "avatar_39.webp" },
  { id: "ec83ad51-77b4-412a-b4e5-3539f48a4881", image: "avatar_40.webp" },
  { id: "8ad7bedd-b687-4b9e-9997-1e67bd612411", image: "avatar_41.webp" },
  { id: "d0d50c7b-2b34-4033-a9ff-6c03d5a70457", image: "avatar_42.webp" },
  { id: "122e0d72-c4d4-47d8-8c0e-795d19f68fd5", image: "avatar_43.webp" },
  { id: "86312aac-0811-464e-abcf-8c057a2f2072", image: "avatar_44.webp" },
  { id: "b5888417-b99e-4494-9961-898bed59c91a", image: "avatar_45.webp" },
  { id: "b5895bd0-9053-4aeb-9f95-0926fc7ca5a9", image: "avatar_46.webp" },
  { id: "c31e4700-b745-4a07-b4ba-9c4082920590", image: "avatar_47.webp" },
  { id: "7a34ccd4-eebc-4140-aaf0-2caa38f46fd8", image: "avatar_48.webp" },
  { id: "d2c58ae2-071f-47c8-b15e-6ce37ae7b112", image: "avatar_49.webp" },
  { id: "5a69e5a7-3a4c-4e88-8e0b-a0771ef5f24c", image: "avatar_50.webp" },
  { id: "6600129a-c3f9-46d3-a7af-b5e9b284c3f5", image: "avatar_51.webp" },
  { id: "a9c92823-02cc-479b-9a02-7261488a0749", image: "avatar_52.webp" },
  { id: "a9bf6bef-38d9-4d6b-9ebf-bd43638034a9", image: "avatar_53.webp" },
  { id: "766a89dd-2280-4f74-8b64-ab39a8f94895", image: "avatar_54.webp" },
  { id: "f007acdd-9ec8-455a-af38-0981e6ec33d6", image: "avatar_55.webp" },
  { id: "9ee259e5-5467-443e-b048-90d26c3a5fc8", image: "avatar_56.webp" },
  { id: "24b0bbe5-e014-468d-8f35-a2293dbd56ea", image: "avatar_57.webp" },
  { id: "040b383e-d01a-4a5d-b465-6abdbe235a6d", image: "avatar_58.webp" },
  { id: "5fd25c18-3729-4c31-acc9-b0972af5f34e", image: "avatar_59.webp" },
  { id: "cbafdac5-8632-4d1f-9a0f-401e722a69d1", image: "avatar_60.webp" },
  { id: "b164b118-f9ba-48bf-9936-4f4840b7c48f", image: "avatar_61.webp" },
  { id: "5139790c-1409-4def-a47a-a55ddf79bb66", image: "avatar_62.webp" },
  { id: "2576b5a1-b6f7-47b3-8daf-c25701c86115", image: "avatar_63.webp" },
  { id: "f6d48db9-b755-450a-bb80-fa1a6b5f8b9d", image: "avatar_64.webp" },
  { id: "367f1785-ea9f-4d76-bbe4-b4418739354a", image: "avatar_65.webp" },
  { id: "422b3700-650f-4329-af5d-567713a1058f", image: "avatar_66.webp" },
  { id: "31074b2f-aa10-478b-be48-48d4298f907e", image: "avatar_67.webp" },
  { id: "be0425ba-c88c-4043-86a8-188ee1385b00", image: "avatar_68.webp" },
  { id: "f961acf2-6fe8-4311-a9c7-302905013fac", image: "avatar_69.webp" },
  { id: "d5c01198-4e4f-4604-82a1-1e47b093d06f", image: "avatar_70.webp" },
  { id: "9ba7c05a-4348-43f9-a043-918068991e69", image: "avatar_71.webp" },
  { id: "a0e098be-cf5c-4ca4-850f-191a4170a33c", image: "avatar_72.webp" },
  { id: "2d223f39-78fa-4bf6-9f99-b25567d64959", image: "avatar_73.webp" },
  { id: "d2d441b3-918f-471d-8b83-dddb7331f8a8", image: "avatar_74.webp" },
  { id: "13ff613b-01e3-42b9-8521-1f6ccc354887", image: "avatar_75.webp" },
  { id: "80f2a336-94d3-4e6f-9ece-c0850fc61345", image: "avatar_76.webp" },
  { id: "decb688d-089a-43a5-a4e0-33e075c7cd28", image: "avatar_77.webp" },
  { id: "0c5e306b-3113-4c42-9981-c3e96fe87ec0", image: "avatar_78.webp" },
  { id: "9548f532-759f-45fe-8e9c-78705d8e54d9", image: "avatar_79.webp" },
  { id: "6880c309-72dd-4cb7-9ed6-9020a718c139", image: "avatar_80.webp" },
  { id: "b3480402-d088-424c-a302-985fb2ce2bd3", image: "avatar_81.webp" },
  { id: "19bff327-5689-4f3c-b1e0-74b675fb5b7b", image: "avatar_82.webp" },
  { id: "9abfb917-b080-40f0-867c-551b97da9d0c", image: "avatar_83.webp" },
  { id: "e246b7b3-68a0-463d-8123-78e6358bc675", image: "avatar_84.webp" },
  { id: "0c9c2115-48f1-47f1-9be5-c3a6e4f8a0f1", image: "avatar_85.webp" },
  { id: "91dd8f1b-66fa-4af3-9aca-96982d53887b", image: "avatar_86.webp" },
  { id: "d4bdc496-744b-4c64-b033-38cbab22cd6e", image: "avatar_87.webp" },
  { id: "0d5153c7-c280-4276-89e7-b96bca7f8eb2", image: "avatar_88.webp" },
  { id: "5fe17cd5-d445-455a-8f6e-2495baee400b", image: "avatar_89.webp" },
  { id: "fe9b2f6e-3946-458e-ab58-ab706ea33ddb", image: "avatar_90.webp" },
  { id: "fbb59461-f7fe-4f37-90a9-0ec9afbde19f", image: "avatar_91.webp" },
  { id: "8007313c-ffa5-4ba7-8c0a-1a3453a134dd", image: "avatar_92.webp" },
  { id: "2678be9e-3274-4b76-a35b-3c65292cc55a", image: "avatar_93.webp" },
  { id: "8c9704d6-17a5-4631-b2bd-c0340b5e6657", image: "avatar_94.webp" },
  { id: "e7d1a448-d2bc-4b0f-b0dc-6452ceb67265", image: "avatar_95.webp" },
  { id: "154af9fc-90f1-4b18-80f8-c600b80ca4c9", image: "avatar_96.webp" },
  { id: "87c96093-8038-4bbc-b3ef-0f51bc38fb36", image: "avatar_97.webp" },
  { id: "f7e042c1-b0ec-4919-be23-6ffa2a25a7ab", image: "avatar_98.webp" },
  { id: "603f354c-ccb8-4b5b-90fa-3a9fc528bcc8", image: "avatar_99.webp" },
  { id: "d78bfbac-2252-428e-98fb-fba2acfd69ba", image: "avatar_100.webp" },
  { id: "12e7d6ea-9401-44b2-91a2-6fdb048af96c", image: "avatar_101.webp" },
  { id: "912412f7-9788-4471-a968-a6c69891df93", image: "avatar_102.webp" },
  { id: "c2c6376d-79c0-4240-99f4-1e647fd58cbf", image: "avatar_103.webp" },
  { id: "1be02c00-b8b0-4b77-9d50-24a1383e0bb6", image: "avatar_104.webp" },
  { id: "b4e0e1ae-0eb5-4604-9caf-a67a15cdd978", image: "avatar_105.webp" },
];

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
}

const network = "staging";
const identity = network === "production" ? "elna" : "elna-dev";

try {
  const allWizardsRaw = await executeCommand(
    `dfx canister call wizard_details getAllWizards --network=${network} --identity=${identity} --output=json`
  );
  const allImagesRaw = await executeCommand(
    `cd ../../elna-images && dfx canister call elna_images_backend get_all_assets --network=${network} --identity=${identity} --output=json`
  );
  const allWizards = JSON.parse(allWizardsRaw);
  const allImages = JSON.parse(allImagesRaw);
  const list = allImages["Ok"].map(image => ({
    id: image["0"],
    fileName: image["1"].file_name,
  }));

  const finalMigrationList = CONVERTOR.reduce((acc, data) => {
    const newData = list.find(element => element.fileName === data.image);
    acc[data.id] = newData.id;
    return acc;
  }, {});
  console.log(finalMigrationList);

  for (let i = 0; i < allWizards.length; i++) {
    const wizard = allWizards[i];
    const newData = finalMigrationList[wizard.avatar.trim()];
    console.log(
      `name:${wizard.name}:`,
      `id:${wizard.id}`,
      `avatarOld:${wizard.avatar}`,
      `avatarNew:${newData}`
    );
    try {
      if (newData === undefined) {
        throw new Error("Avatar migration not found");
      }
      const d = await executeCommand(
        `dfx canister call wizard_details updateWizardAdmin '("${wizard.id}","${newData}")' --network=${network} --identity=${identity}`
      );
      console.log(d);
    } catch (e) {
      console.log("Unable to update", wizard);
      console.error(e);
    }
  }
} catch (error) {
  console.error(error);
}
