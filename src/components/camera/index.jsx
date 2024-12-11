'use client'

import Image from "next/image";
import { useRef, useState } from "react";
import { TiCamera } from "react-icons/ti";

const CameraComponent = ({ imageData, setImageData }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);  // Menyimpan stream kamera
    const [start, setStart] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [resultStream, setResultStream] = useState(false)

    // Akses kamera
    const startCamera = async () => {
        try {
            setStart(true)
            setIsLoading(true);
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setStream(newStream);
            setIsLoading(false);
            // Menyimpan stream agar bisa dihentikan nanti
        } catch (err) {
            console.error("Gagal mengakses kamera:", err);
        }
    };

    // Ambil foto dan berhentikan kamera
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Simpan gambar sebagai Base64
            const dataUrl = canvas.toDataURL("image/png");
            setImageData(dataUrl);

            // Berhentikan kamera setelah foto diambil
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());  // Berhentikan setiap track video
                setStream(null);  // Reset stream
                setStart(false)
                setResultStream(true)
            }
        }
    };

    return (
        <div className="mt-3" >
            <h1>Ambil Foto</h1>
            <div className={`w-full h-screen fixed top-0 left-0 bg-black/50 ${start ? 'flex' : 'hidden'} justify-center items-center`} >
                <div className="w-[40%] relative flex justify-center" >
                    <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "auto" }} />
                    <button type="button" className="p-1 bg-white rounded-full absolute bottom-2" onClick={capturePhoto}>
                        <TiCamera className={`text-6xl ${imageData !== null ? 'text-primary' : 'text-black/80'}`} />
                    </button>
                </div>
            </div>
            <div className={`w-full h-screen fixed top-0 left-0 bg-black/50 ${resultStream ? 'flex' : 'hidden'} justify-center items-center`} >
                <div className="w-[40%]" >
                    {imageData !== null
                        ? <Image className="w-full h-auto" src={imageData} alt="hasil camera" width={400} height={200} />
                        : null}
                    <div className={`bg-white text-center ${isLoading ? 'hidden' : 'block'}`} >
                        <button type="button" onClick={() => setResultStream(false)}>close</button>
                    </div>
                </div>
            </div>
            <div className="flex gap-x-3">
                {imageData !== null
                    ? <div className="relative flex justify-center" >
                        <Image className="h-auto rounded-lg" src={imageData} alt="hasil camera" width={160} height={20} />
                        <button type="button" className="p-1 absolute bottom-1 left-1 bg-white rounded-full" onClick={startCamera}>
                            <TiCamera className={`text-3xl ${imageData !== null ? 'text-primary' : 'text-black/80'}`} />
                        </button>
                    </div>
                    : <button type="button" onClick={startCamera}>
                        <TiCamera className={`text-6xl ${imageData !== null ? 'text-primary' : 'text-black/80'}`} />
                    </button>}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default CameraComponent;