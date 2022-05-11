import { NotificationApi } from "@/js/apis"
import { updatePagination } from "@/js/utils/paginationReducer"
import { useMutation, useQueryClient } from "react-query"
import queryKeyFactory from "../queryKeyFactory"

export default function useReadAllNotificationsMutator(filter) {

    const queryClient = useQueryClient()
    const queryKey = queryKeyFactory.notifications(filter)

    return useMutation(NotificationApi.markAllAsRead, {
        async onMutate() {

            await queryClient.cancelQueries(queryKey)

            const previous = queryClient.getQueryData(queryKey)
            const now = moment()

            queryClient.setQueryData(queryKey, updatePagination(function(old) {
                if (old.read_at == null) {
                    return {...old, read_at: now}
                }
                return old
            }))

            return { previous }
        },

        onError(_error, _arg, context) {
            message.error('An error occured')
            queryClient.setQueryData(queryKey, context.previous)
        },

        onSettled() {
            queryClient.invalidateQueries(queryKey)
        }
    })
}