"use server"

export async function submitFormAA(formData: FormData) {
    "use server"

    const rawFormData = {
        customerId: formData.get('name'),
    }

    console.log(rawFormData)
}
