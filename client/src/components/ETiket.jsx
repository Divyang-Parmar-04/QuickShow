import QRCode from "react-qr-code"
import domtoimage from "dom-to-image-more"
import jsPDF from "jspdf"
import { DownloadIcon, X } from "lucide-react"

const ETicket = ({ booking }) => {

    const downloadTicket = async () => {
        const node = document.getElementById("ticket")

        const dataUrl = await domtoimage.toPng(node)

        const pdf = new jsPDF()
        pdf.addImage(dataUrl, "PNG", 0, 10, 210, 0)
        pdf.save("QuickShow-Ticket.pdf")
    }


    return (
        <div className="flex justify-center relative">
            <div
                id="ticket"
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
                className="w-[360px] rounded-3xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex gap-3 p-4 border-b">
                    <img
                        src={booking.poster}
                        alt="movie"
                        className="w-20 h-28 rounded-xl object-cover"
                    />
                    <div>
                        <h2 className="font-bold text-lg">{booking.movie}</h2>
                        <p className="text-sm text-gray-500">
                            {booking.language}, {booking.format}
                        </p>
                        <p className="text-sm mt-1">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.theater}</p>
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">{booking.totalT} Ticket(s)</p>
                    <h3 className="text-lg font-semibold">{booking.screen}</h3>
                    <p className="text-gray-600">{booking.seat}</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center py-4">
                    <QRCode value={booking.bookingId} size={140} />
                </div>

                <p className="text-center text-sm font-medium">
                    BOOKING ID: {booking.bookingId}
                </p>

                {/* Info */}
                <div className="bg-gray-100 text-xs text-center p-3 mt-4">
                    Cancellation unavailable: cut-off time of 20 minutes before showtime
                </div>

                {/* Price */}
                <div className="p-4 text-sm space-y-1 border-t">
                    <div className="flex justify-between">
                        <span>Ticket Price</span>
                        <span>₹ {booking.price}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Convenience Fee</span>
                        <span>₹ {booking.fee}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total Amount</span>
                        <span>₹ {booking.total}</span>
                    </div>
                </div>

                {/* Download Button */}
                <div className="flex justify-center m-2">
                    {/* <button
                        onClick={downloadTicket}
                        className="px-8 py-2 rounded-3xl bg-black text-white  cursor-pointer"
                    >
                        <DownloadIcon />
                    </button> */}
                </div>

                <button className="absolute right-0 top-0 bg-red-500 text-white rounded-tr-3xl cursor-pointer p-1" onClick={() => booking.onHandleCloseTiketView()}><X /></button>
            </div>


        </div>
    )
}

export default ETicket
