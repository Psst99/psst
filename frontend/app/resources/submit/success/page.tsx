export default function ResourceSubmitSuccessPage() {
  return (
    <div className="p-4 h-full w-full md:max-w-[65vw] mx-auto text-center">
      <button className="mt-16 bg-[#FE93E7] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block disabled:opacity-50">
        Thank you!
      </button>
      <p className="text-xl text-gray-600">
        Your resource submission has been received and will be reviewed shortly.
      </p>
    </div>
  )
}
