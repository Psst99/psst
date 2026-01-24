import {useFormValue, useClient, NumberInputProps, NumberSchemaType} from 'sanity'
import {useEffect, useState} from 'react'
import {Stack, Text} from '@sanity/ui'

export function AvailableSpotsInput(props: NumberInputProps<NumberSchemaType>) {
  const client = useClient({apiVersion: '2023-01-01'})
  const document = useFormValue([]) as any // Access the full document
  const [available, setAvailable] = useState<number | null>(null)

  useEffect(() => {
    if (!document?._id || !document?.totalSpots) return

    const fetchAvailableSpots = async () => {
      try {
        const approvedCount = await client.fetch(
          `count(*[_type == "workshopRegistration" && workshop._ref == $workshopId && status == "approved"])`,
          {workshopId: document._id},
        )
        const calculated = document.totalSpots - approvedCount
        setAvailable(calculated)
        // Do NOT call props.onChange since this is read-only and we're not updating the field value
      } catch (error) {
        console.error('Error fetching available spots:', error)
      }
    }

    fetchAvailableSpots()
  }, [client, document?._id, document?.totalSpots])

  return (
    <Stack space={3} className="mt-8">
      <Text size={1} weight="medium">
        {available !== null ? `${available} spots available` : 'Calculating...'}
      </Text>
      <Text size={1} muted>
        Total spots: {document?.totalSpots} | Approved registrations:{' '}
        {document?.totalSpots - (available || 0)}
      </Text>
    </Stack>
  )
}
