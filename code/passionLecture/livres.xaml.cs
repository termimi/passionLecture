using System;
using System.IO;
using Aspose.Pdf;
using Aspose;
using static System.Reflection.Metadata.BlobBuilder;
using System.Reflection;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VersOne.Epub;
using System.IO.Compression;
using System.Text;
using System.Xml;
using HtmlAgilityPack;
using System.Diagnostics;


namespace passionLecture;

public partial class livres : ContentPage
{
    HttpClient client = new();
    public List<EpubBook> listOfBooks = new List<EpubBook>();
    public EpubBook book;
    string contentText;
    public livres()
	{
        InitializeComponent();
    
	}
    public async Task<int> GetNumberOfBooks()
    {
        
        try
        {
            int numberOfBook = 0;
            string apiUrl = "http://10.0.2.2:3000/api/books/numberOfBook";
            var response = await client.GetAsync(apiUrl);

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    var content = response.Content;
                    //EpubBook book = EpubReader.ReadBook(content.ReadAsStream());
                    var stream = content.ReadAsStream();
                    StreamReader textStream = new StreamReader(stream);
                    string bla = textStream.ReadLine();
                    numberOfBook = int.Parse(bla);
                    return numberOfBook;
                }
                catch (Exception ex)
                {
                    allBooksLabel.Text += ex.Message;
                    return 0;
                }
            }
            else
            {
                return 0;
            }
        }
        catch (Exception ex)
        {
            allBooksLabel.Text = ex.Message;
            return 0;
        }
    }
    public async void GetBooks2(object sender, EventArgs e)
    {
        int numberOfBook = await GetNumberOfBooks();
        for (int i = 1; i < numberOfBook; i++)
        {
            string apiUrl = $"http://10.0.2.2:3000/api/books/{i}/epub";
            try
            {
                var response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var content = response.Content;
                        book = EpubReader.ReadBook(content.ReadAsStream());
                        listOfBooks.Add(book);
                        Button titleButton = new Button();
                        titleButton.Text = book.Title;
                        booksPage.Children.Add(titleButton);
                        titleButton.Clicked +=(s,args) => readBook(titleButton.Text);
                        PrintChapters();
                    }
                    catch (Exception ex)
                    {
                        allBooksLabel.Text += ex.Message;
                    }
                }
            }
            catch (Exception ex)
            {
                allBooksLabel.Text = ex.Message;
            }
            void PrintChapters()
            {
                foreach (EpubLocalTextContentFile textContentFile in book.ReadingOrder)
                {
                    PrintTextContentFile(textContentFile);
                }
            }
            void PrintTextContentFile(EpubLocalTextContentFile textContentFile)
            {
                HtmlDocument htmlDocument = new();
                htmlDocument.LoadHtml(textContentFile.Content);
                StringBuilder sb = new();
                foreach (HtmlNode node in htmlDocument.DocumentNode.SelectNodes("//text()"))
                {
                    sb.AppendLine(node.InnerText.Trim());
                }
                contentText = sb.ToString();
                Trace.WriteLine(contentText);

            }
        }     
    }
    
    public async void readBook(string title)
    {
        foreach (var book in listOfBooks)
        {
            if(book.Title  == title)
            {
              Lecture lecture = new Lecture();
                lecture.setTextOfPage(contentText);
              Navigation.PushAsync(lecture);
            }
            
        }
     
    }

}

