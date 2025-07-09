const uploadImage = async (file) => {
  if (!file) return;
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "nexchat-profile-photo");
  data.append("cloud_name", "dbhge9dnm");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dbhge9dnm/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const uploadedImage = await res.json();
  return uploadedImage;
};
export default uploadImage;
