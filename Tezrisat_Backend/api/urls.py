from django.urls import path, re_path


from . import views
from .views import (
    PaymentListView,
    CreatePaymentIntentView,
    CancelSubscriptionView,
    UpdateSubscriptionView,
)

# URLConfiguration
urlpatterns = [
    re_path(r'^microcourses/$', views.get_microcourses),
    path('microcourses/<int:pk>/', views.get_microcourse, name='get_microcourse'),
    path("get_currentuser/", views.get_current_user, name="get_current_user"),
    path("profile/", views.get_current_user, name="get_current_user"),

    re_path(r'^add_microcourse/$', views.add_microcourse),
    path("delete_microcourse/<int:microcourse_id>/", views.delete_microcourse, name="delete_microcourse"),
    re_path(r'^generate_next_section/$', views.go_in_depth, name='go_in_depth'),
    path("agent_response/", views.get_agent_response, name="get_agent_response"),

    path("add_glossary_term/", views.add_glossary_term, name="add_glossary_term"),
    path("delete_glossary_term/<int:term_id>/", views.delete_glossary_term, name="delete_glossary_term"),
    path("add_note/", views.add_note, name="add_note"),
    path("delete_note/<int:note_id>/", views.delete_note, name="delete_note"),

    path("updateprofile/", views.update_profile, name="update_profile"),

    path("payment/", PaymentListView.as_view(), name="payment-list"),
    path("create-payment-intent/", CreatePaymentIntentView.as_view(), name="create-payment-intent"),
    path("cancel-subscription/", CancelSubscriptionView.as_view(), name="cancel-subscription"),
    path("update-subscription/", UpdateSubscriptionView.as_view(), name="update-subscription"),

]

