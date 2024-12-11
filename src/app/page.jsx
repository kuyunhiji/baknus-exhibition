'use client'
import CameraComponent from "@/components/camera"
import Image from "next/image"
import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

const Page = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(false)
  const namaRef = useRef()
  const kelasRef = useRef()
  const sekolahRef = useRef()
  const alamatRef = useRef()

  const handleUpload = async () => {

    if (!file || namaRef.current.value == "" || kelasRef.current.value == "" || sekolahRef.current.value == "" || alamatRef.current.value == "") {
      return
    } 

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Upload preset
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME); // Nama Cloud

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        try {
          const response = await fetch("/api/daftar_hadir", {
            method: 'POST',
            headers: {
              'Content-Type': 'aplication/json'
            },
            body: JSON.stringify({
              foto: data.secure_url,
              nama: namaRef.current.value,
              kelas: kelasRef.current.value,
              sekolah: sekolahRef.current.value,
              alamat: alamatRef.current.value,
            })
          })
          const result = await response.json()
          if (response.status == 200) {
            setStatus(true)
          }
          console.log(result)
          setUploading(false);
        } catch (error) {
          console.log(error)
          setUploading(false);
        }
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Terjadi kesalahan saat mengupload file.");
      setUploading(false);
    }

  };



  return (
    <div className="w-full h-screen flex" >
      <div className="w-2/4 h-full flex justify-center items-center relative" >
        <div className="w-96 h-96 bg-primary rounded-full absolute -top-56 -left-64" ></div>
        <div className={`w-full h-screen fixed top-0 left-0 ${uploading ? 'block' : 'hidden'} flex justify-center items-center bg-black/50 z-40`} >
          <div className="spinner" ></div>
        </div>
        <div className={`px-5 py-1 bg-primary font-medium text-white ${status ? 'flex gap-x-3 items-center' : 'hidden'} fixed bottom-3 right-3 z-10 animation rounded-lg`} >
          <p>Berhasil</p>
          <IoMdClose onClick={() => setStatus(false)} className="text-white text-xl cursor-pointer" />
        </div>
        <div className="w-[420px]">
          <h1 className="text-4xl" >Daftar Hadir</h1>
          <CameraComponent imageData={file} setImageData={setFile} />
          <div className="mt-3 flex flex-col" >
            <label htmlFor="">Nama</label>
            <input ref={namaRef} className="mt-1 p-1 border-2 border-black/50 outline-primary rounded-lg" type="text" />
          </div>
          <div className="mt-3 flex flex-col">
            <label htmlFor="">Kelas</label>
            <input ref={kelasRef} className="mt-1 p-1 border-2 border-black/50 outline-primary rounded-lg" type="text" />
          </div>
          <div className="mt-3 flex flex-col">
            <label htmlFor="">Asal Sekolah</label>
            <input ref={sekolahRef} className="mt-1 p-1 border-2 border-black/50 outline-primary rounded-lg" type="text" />
          </div>
          <div className="mt-3 flex flex-col">
            <label htmlFor="">Alamat</label>
            <input ref={alamatRef} className="mt-1 p-1 border-2 border-black/50 outline-primary rounded-lg" type="text" />
          </div>
          <button onClick={() => handleUpload()} className={`mt-3 px-8 py-2 font-medium bg-primary text-white text-lg rounded-lg`} >{uploading ? 'loading' : 'simpan'}</button>
        </div>
      </div>
      <div className="w-2/4 h-full flex justify-center items-center">
        <Image src={"/baknusExhibition.jpeg"} alt="Baknus Exhibition" width={800} height={300} />
      </div>
    </div>
  )
}

export default Page