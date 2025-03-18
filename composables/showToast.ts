import {createVNode, render, type DefineComponent} from 'vue'

export async function showToast(type: 'success' | 'danger' | 'warning', message: string, timeout = 5000) {
    const container = document.createElement('div')
    let toaster = document.querySelector('#toaster')
    toaster?.appendChild(container)

    let Toast: DefineComponent<any, any, any>
    switch (type) {
        case "success":
            Toast = (await import('~/components/Toast/ToastSuccess.vue')).default
            break;
        case "danger":
            Toast = (await import('~/components/Toast/ToastDanger.vue')).default
            break;
        case "warning":
            Toast = (await import('~/components/Toast/ToastWarning.vue')).default
            break;
    }
    // Create a VNode for ToastSuccess with the provided props
    const vnode = createVNode(Toast, {message, timeout})

    // Render the VNode into the container
    render(vnode, container)

    // Optionally unmount after the timeout + transition duration
    setTimeout(() => {
        render(null, container)
        toaster?.removeChild(container)
    }, timeout + 1200)
}
